package za.co.crosswithswag.api.infrastructure.payfast;

import java.util.Collections;
import za.co.crosswithswag.api.application.checkout.CheckoutResult;
import za.co.crosswithswag.api.application.payment.PaymentProvider;
import za.co.crosswithswag.api.domain.order.Order;

public class StubPaymentProvider implements PaymentProvider {

	@Override
	public CheckoutResult createCheckout(Order order) {
		return new CheckoutResult(
				order.ref(),
				"https://sandbox.payfast.co.za/eng/process",
				Collections.singletonMap("m_payment_id", order.ref()));
	}

	@Override
	public ItnVerdict verifyItn(java.util.Map<String, String> params) {
		return ItnVerdict.IGNORED;
	}
}
