package za.co.crosswithswag.api.application;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import java.io.IOException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import za.co.crosswithswag.api.application.checkout.CheckoutCommand;
import za.co.crosswithswag.api.application.checkout.CheckoutException;
import za.co.crosswithswag.api.application.checkout.CheckoutService;
import za.co.crosswithswag.api.application.checkout.ShippingCalculator;
import za.co.crosswithswag.api.application.order.InMemoryOrderRepository;
import za.co.crosswithswag.api.application.order.OrderRefGenerator;
import za.co.crosswithswag.api.domain.catalog.CatalogPricingService;
import za.co.crosswithswag.api.domain.catalog.LineRequest;
import za.co.crosswithswag.api.domain.order.ShipMethod;
import za.co.crosswithswag.api.infrastructure.catalog.JsonCatalogRepository;
import za.co.crosswithswag.api.infrastructure.payfast.StubPaymentProvider;

class CheckoutValidationTest {

	private CheckoutService checkout;
	private CatalogPricingService pricing;

	@BeforeEach
	void setUp() throws IOException {
		var catalog = new JsonCatalogRepository().loadFromClasspath("catalog.json");
		pricing = new CatalogPricingService(catalog);
		checkout = new CheckoutService(
				pricing,
				new ShippingCalculator(6_000),
				new InMemoryOrderRepository(),
				new OrderRefGenerator(() -> 0.123456),
				new StubPaymentProvider());
	}

	@Test
	void paxiShippingAddsConfiguredFee() {
		assertThat(new ShippingCalculator(6_000).shippingCents(ShipMethod.PAXI_COLLECT)).isEqualTo(6_000);
		assertThat(new ShippingCalculator(6_000).shippingCents(ShipMethod.PRIVATE_SHIP)).isZero();
	}

	@Test
	void paxiCollectRequiresPaxiCode() {
		var cmd = baseCommand(ShipMethod.PAXI_COLLECT).withPaxiCode(null);
		assertThatThrownBy(() -> checkout.checkout(cmd))
				.isInstanceOf(CheckoutException.class)
				.hasMessageContaining("paxi_code");
	}

	@Test
	void privateShipRequiresAddress() {
		var cmd = baseCommand(ShipMethod.PRIVATE_SHIP).withAddressText(null);
		assertThatThrownBy(() -> checkout.checkout(cmd))
				.isInstanceOf(CheckoutException.class)
				.hasMessageContaining("address");
	}

	@Test
	void rejectsQtyBelowOne() {
		var cmd = baseCommand(ShipMethod.PAXI_COLLECT)
				.withLines(java.util.List.of(new LineRequest("express-dispatch-black", "M", 0)));
		assertThatThrownBy(() -> checkout.checkout(cmd))
				.isInstanceOf(CheckoutException.class);
	}

	private CheckoutCommand baseCommand(ShipMethod method) {
		return new CheckoutCommand(
				"Marcus",
				"marcus@example.com",
				"0820000000",
				java.util.List.of(new LineRequest("express-dispatch-black", "M", 1)),
				method,
				method == ShipMethod.PAXI_COLLECT ? "PEP123" : null,
				method == ShipMethod.PAXI_COLLECT ? "PEP Store" : null,
				method == ShipMethod.PAXI_COLLECT ? "1 Main Rd" : null,
				method == ShipMethod.PRIVATE_SHIP ? "12 Oak St, Cape Town" : null);
	}
}
