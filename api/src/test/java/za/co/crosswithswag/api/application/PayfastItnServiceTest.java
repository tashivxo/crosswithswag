package za.co.crosswithswag.api.application;

import static org.assertj.core.api.Assertions.assertThat;

import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import za.co.crosswithswag.api.application.mail.PaidOrderMailer;
import za.co.crosswithswag.api.application.mail.RecordingMailPort;
import za.co.crosswithswag.api.application.order.InMemoryOrderRepository;
import za.co.crosswithswag.api.application.payfast.PayfastItnService;
import za.co.crosswithswag.api.application.payfast.PayfastProperties;
import za.co.crosswithswag.api.application.payment.PaymentProvider;
import za.co.crosswithswag.api.domain.order.Order;
import za.co.crosswithswag.api.domain.order.OrderLine;
import za.co.crosswithswag.api.domain.order.OrderStatus;
import za.co.crosswithswag.api.domain.order.ShipMethod;
import za.co.crosswithswag.api.infrastructure.payfast.PayfastPaymentProvider;
import za.co.crosswithswag.api.infrastructure.payfast.PayfastSignature;

class PayfastItnServiceTest {

	private static final String PASSPHRASE = "testphrase";

	private InMemoryOrderRepository repository;
	private PayfastItnService itnService;
	private PayfastSignature signature;
	private RecordingMailPort mail;

	@BeforeEach
	void setUp() {
		repository = new InMemoryOrderRepository();
		signature = new PayfastSignature();
		mail = new RecordingMailPort();
		var props = new PayfastProperties(
				"10000100",
				"merchant-key",
				PASSPHRASE,
				true,
				"http://localhost:3000/order/confirmed",
				"http://localhost:3000/checkout",
				"http://localhost:8080/v1/payfast/itn");
		var provider = new PayfastPaymentProvider(props, signature, repository);
		itnService = new PayfastItnService(
				repository, provider, new PaidOrderMailer(mail, "orders@crosswithswag.co.za"));
	}

	@Test
	void paidWhenSignatureValidAndAmountMatches() {
		Order order = saveCreatedOrder("SWAG-PAID1", 41_000);
		Map<String, String> params = itnParams(order.ref(), "410.00");
		params.put("signature", signature.sign(params, PASSPHRASE));

		var result = itnService.handle(params);
		assertThat(result).isEqualTo(PaymentProvider.ItnVerdict.PAID);
		assertThat(repository.findByRef(order.ref()).orElseThrow().status()).isEqualTo(OrderStatus.PAID);
		assertThat(mail.sent()).hasSize(2);
	}

	@Test
	void failedWhenSignatureWrong() {
		saveCreatedOrder("SWAG-FAIL1", 41_000);
		Map<String, String> params = itnParams("SWAG-FAIL1", "410.00");
		params.put("signature", "00000000000000000000000000000000");

		assertThat(itnService.handle(params)).isEqualTo(PaymentProvider.ItnVerdict.FAILED);
	}

	@Test
	void ignoredWhenAmountMismatch() {
		Order order = saveCreatedOrder("SWAG-IGN1", 41_000);
		Map<String, String> params = itnParams(order.ref(), "1.00");
		params.put("signature", signature.sign(params, PASSPHRASE));

		assertThat(itnService.handle(params)).isEqualTo(PaymentProvider.ItnVerdict.IGNORED);
		assertThat(repository.findByRef(order.ref()).orElseThrow().status()).isEqualTo(OrderStatus.CREATED);
	}

	@Test
	void idempotentWhenAlreadyPaid() {
		Order order = saveCreatedOrder("SWAG-IDEM1", 41_000);
		order.markPaid("pf-1", "{}", Instant.now());
		repository.save(order);
		Map<String, String> params = itnParams(order.ref(), "410.00");
		params.put("signature", signature.sign(params, PASSPHRASE));

		assertThat(itnService.handle(params)).isEqualTo(PaymentProvider.ItnVerdict.PAID);
		assertThat(mail.sent()).isEmpty();
	}

	private Order saveCreatedOrder(String ref, int totalCents) {
		Instant now = Instant.now();
		Order order = new Order(
				UUID.randomUUID(),
				ref,
				OrderStatus.CREATED,
				"buyer@example.com",
				"Buyer",
				"082",
				ShipMethod.PAXI_COLLECT,
				"P1",
				null,
				null,
				null,
				totalCents - 6_000,
				6_000,
				totalCents,
				"ZAR",
				List.of(new OrderLine("express-dispatch-black", "M", 1, 35_000, "PRODUCT EXPRESS", "black")),
				now,
				now);
		return repository.save(order);
	}

	private Map<String, String> itnParams(String ref, String amountGross) {
		Map<String, String> params = new LinkedHashMap<>();
		params.put("m_payment_id", ref);
		params.put("pf_payment_id", "999");
		params.put("payment_status", "COMPLETE");
		params.put("item_name", "SWAG order");
		params.put("amount_gross", amountGross);
		params.put("merchant_id", "10000100");
		return params;
	}
}
