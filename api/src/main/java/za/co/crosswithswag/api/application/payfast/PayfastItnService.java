package za.co.crosswithswag.api.application.payfast;

import java.time.Instant;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.transaction.annotation.Transactional;
import za.co.crosswithswag.api.application.mail.MailPort;
import za.co.crosswithswag.api.application.order.OrderRepository;
import za.co.crosswithswag.api.application.payment.PaymentProvider;
import za.co.crosswithswag.api.domain.order.Order;
import za.co.crosswithswag.api.domain.order.OrderStatus;

public class PayfastItnService {

	private static final Logger log = LoggerFactory.getLogger(PayfastItnService.class);

	private final OrderRepository orderRepository;
	private final PaymentProvider paymentProvider;
	private final MailPort mailPort;

	public PayfastItnService(OrderRepository orderRepository, PaymentProvider paymentProvider, MailPort mailPort) {
		this.orderRepository = orderRepository;
		this.paymentProvider = paymentProvider;
		this.mailPort = mailPort;
	}

	@Transactional
	public PaymentProvider.ItnVerdict handle(Map<String, String> params) {
		PaymentProvider.ItnVerdict verdict = paymentProvider.verifyItn(params);
		if (verdict == PaymentProvider.ItnVerdict.FAILED) {
			log.warn("PayFast ITN signature failed for m_payment_id={}", params.get("m_payment_id"));
			return verdict;
		}
		if (verdict != PaymentProvider.ItnVerdict.PAID) {
			log.info("PayFast ITN ignored m_payment_id={}", params.get("m_payment_id"));
			return PaymentProvider.ItnVerdict.IGNORED;
		}
		String ref = params.get("m_payment_id");
		Order order = orderRepository.findByRef(ref).orElse(null);
		if (order == null) {
			return PaymentProvider.ItnVerdict.IGNORED;
		}
		if (order.status() == OrderStatus.PAID) {
			log.info("PayFast ITN idempotent for ref={}", ref);
			return PaymentProvider.ItnVerdict.PAID;
		}
		order.markPaid(params.get("pf_payment_id"), params.toString(), Instant.now());
		orderRepository.save(order);
		sendPaidMails(order);
		log.info("PayFast ITN marked PAID ref={}", ref);
		return PaymentProvider.ItnVerdict.PAID;
	}

	private void sendPaidMails(Order order) {
		mailPort.send(new MailPort.MailMessage(
				order.email(),
				"SWAG order confirmed " + order.ref(),
				"Thanks — we received payment for " + order.ref() + ".",
				null));
		mailPort.send(new MailPort.MailMessage(
				"orders@crosswithswag.co.za",
				"New paid order " + order.ref(),
				"Order paid.",
				buildCsv(order)));
	}

	private static String buildCsv(Order order) {
		StringBuilder sb = new StringBuilder("ref,sku,size,qty,unit_price_cents\n");
		for (var line : order.lines()) {
			sb.append(order.ref())
					.append(',')
					.append(line.sku())
					.append(',')
					.append(line.size())
					.append(',')
					.append(line.qty())
					.append(',')
					.append(line.unitPriceCents())
					.append('\n');
		}
		return sb.toString();
	}
}
