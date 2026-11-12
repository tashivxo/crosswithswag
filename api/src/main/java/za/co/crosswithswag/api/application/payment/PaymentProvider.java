package za.co.crosswithswag.api.application.payment;

import java.util.Map;
import za.co.crosswithswag.api.application.checkout.CheckoutResult;
import za.co.crosswithswag.api.domain.order.Order;

public interface PaymentProvider {

	CheckoutResult createCheckout(Order order);

	ItnVerdict verifyItn(Map<String, String> params);

	enum ItnVerdict {
		PAID,
		IGNORED,
		FAILED
	}
}
