package za.co.crosswithswag.api.infrastructure.payfast;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import java.time.Instant;
import java.util.List;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import za.co.crosswithswag.api.application.payfast.PayfastProperties;
import za.co.crosswithswag.api.domain.order.Order;
import za.co.crosswithswag.api.domain.order.OrderLine;
import za.co.crosswithswag.api.domain.order.OrderStatus;
import za.co.crosswithswag.api.domain.order.ShipMethod;

class PayfastPaymentProviderTest {

	@Test
	void returnUrlCarriesOrderRef() {
		assertThat(PayfastPaymentProvider.withRef("http://localhost:3000/order/confirmed", "SWAG-ABC123"))
				.isEqualTo("http://localhost:3000/order/confirmed?ref=SWAG-ABC123");
	}

	@Test
	void checkoutFieldsIncludeSignedReturnUrl() {
		var props = new PayfastProperties(
				"10000100",
				"merchant-key",
				"phrase",
				true,
				"http://localhost:3000/order/confirmed",
				"http://localhost:3000/checkout",
				"http://localhost:8080/v1/payfast/itn");
		var result = new PayfastPaymentProvider(props, new PayfastSignature()).createCheckout(order());
		assertThat(result.redirectUrl()).isEqualTo("https://sandbox.payfast.co.za/eng/process");
		assertThat(result.vendorFields().get("return_url"))
				.isEqualTo("http://localhost:3000/order/confirmed?ref=SWAG-ABC123");
		assertThat(result.vendorFields().get("signature")).isNotBlank();
	}

	@Test
	void rejectsMissingMerchant() {
		var props = new PayfastProperties(
				"", "key", "phrase", true, "http://x", "http://x", "http://x");
		assertThatThrownBy(() -> new PayfastPaymentProvider(props, new PayfastSignature()).createCheckout(order()))
				.isInstanceOf(IllegalStateException.class)
				.hasMessageContaining("PayFast");
	}

	private static Order order() {
		Instant now = Instant.now();
		return new Order(
				UUID.randomUUID(),
				"SWAG-ABC123",
				OrderStatus.CREATED,
				"buyer@example.com",
				"Buyer Name",
				"082",
				ShipMethod.PRIVATE_SHIP,
				null,
				null,
				null,
				"12 Kloof St",
				35_000,
				0,
				35_000,
				"ZAR",
				List.of(new OrderLine("express-dispatch-black", "M", 1, 35_000, "PRODUCT EXPRESS", "black")),
				now,
				now);
	}
}
