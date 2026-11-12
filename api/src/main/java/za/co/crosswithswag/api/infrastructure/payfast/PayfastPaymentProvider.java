package za.co.crosswithswag.api.infrastructure.payfast;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Optional;
import za.co.crosswithswag.api.application.checkout.CheckoutResult;
import za.co.crosswithswag.api.application.order.OrderRepository;
import za.co.crosswithswag.api.application.payfast.PayfastProperties;
import za.co.crosswithswag.api.application.payment.PaymentProvider;
import za.co.crosswithswag.api.domain.order.Order;

public class PayfastPaymentProvider implements PaymentProvider {

	private final PayfastProperties properties;
	private final PayfastSignature signature;
	private final OrderRepository orderRepository;

	public PayfastPaymentProvider(PayfastProperties properties, PayfastSignature signature) {
		this(properties, signature, null);
	}

	public PayfastPaymentProvider(
			PayfastProperties properties, PayfastSignature signature, OrderRepository orderRepository) {
		this.properties = properties;
		this.signature = signature;
		this.orderRepository = orderRepository;
	}

	@Override
	public CheckoutResult createCheckout(Order order) {
		if (properties.merchantId() == null || properties.merchantId().isBlank()
				|| properties.merchantKey() == null || properties.merchantKey().isBlank()) {
			throw new IllegalStateException("PayFast is not configured");
		}
		Map<String, String> fields = new LinkedHashMap<>();
		fields.put("merchant_id", properties.merchantId());
		fields.put("merchant_key", properties.merchantKey());
		fields.put("return_url", withRef(properties.returnUrl(), order.ref()));
		fields.put("cancel_url", properties.cancelUrl());
		fields.put("notify_url", properties.notifyUrl());
		fields.put("email_address", order.email());
		fields.put("name_first", firstName(order.name()));
		fields.put("m_payment_id", order.ref());
		fields.put("amount", formatAmount(order.totalCents()));
		fields.put("item_name", "SWAG order " + order.ref());
		String sig = signature.sign(fields, properties.passphrase());
		fields.put("signature", sig);
		return new CheckoutResult(order.ref(), properties.processUrl(), new LinkedHashMap<>(fields));
	}

	@Override
	public ItnVerdict verifyItn(Map<String, String> params) {
		if (!signature.verify(params, params.get("signature"), properties.passphrase())) {
			return ItnVerdict.FAILED;
		}
		String ref = params.get("m_payment_id");
		if (ref == null || orderRepository == null) {
			return ItnVerdict.IGNORED;
		}
		Optional<Order> order = orderRepository.findByRef(ref);
		if (order.isEmpty()) {
			return ItnVerdict.IGNORED;
		}
		String gross = params.get("amount_gross");
		if (gross == null || !amountsMatch(order.get().totalCents(), gross)) {
			return ItnVerdict.IGNORED;
		}
		String status = params.get("payment_status");
		if (!"COMPLETE".equalsIgnoreCase(status)) {
			return ItnVerdict.IGNORED;
		}
		return ItnVerdict.PAID;
	}

	private static boolean amountsMatch(int totalCents, String amountGross) {
		return formatAmount(totalCents).equals(new BigDecimal(amountGross.trim())
				.setScale(2, RoundingMode.HALF_UP)
				.toPlainString());
	}

	static String formatAmount(int totalCents) {
		return BigDecimal.valueOf(totalCents, 2).setScale(2, RoundingMode.HALF_UP).toPlainString();
	}

	static String withRef(String returnUrl, String ref) {
		if (returnUrl == null || returnUrl.isBlank()) {
			return returnUrl;
		}
		String separator = returnUrl.contains("?") ? "&" : "?";
		return returnUrl + separator + "ref=" + ref;
	}

	private static String firstName(String name) {
		if (name == null || name.isBlank()) {
			return "Guest";
		}
		int space = name.indexOf(' ');
		return space > 0 ? name.substring(0, space) : name;
	}
}
