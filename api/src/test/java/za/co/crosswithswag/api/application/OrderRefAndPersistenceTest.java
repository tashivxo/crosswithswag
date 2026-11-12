package za.co.crosswithswag.api.application;

import static org.assertj.core.api.Assertions.assertThat;

import java.io.IOException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import za.co.crosswithswag.api.application.checkout.CheckoutCommand;
import za.co.crosswithswag.api.application.checkout.CheckoutService;
import za.co.crosswithswag.api.application.checkout.ShippingCalculator;
import za.co.crosswithswag.api.application.order.InMemoryOrderRepository;
import za.co.crosswithswag.api.application.order.OrderRefGenerator;
import za.co.crosswithswag.api.domain.catalog.CatalogPricingService;
import za.co.crosswithswag.api.domain.catalog.LineRequest;
import za.co.crosswithswag.api.domain.order.OrderStatus;
import za.co.crosswithswag.api.domain.order.ShipMethod;
import za.co.crosswithswag.api.infrastructure.catalog.JsonCatalogRepository;
import za.co.crosswithswag.api.infrastructure.payfast.StubPaymentProvider;

class OrderRefAndPersistenceTest {

	private CheckoutService checkout;
	private InMemoryOrderRepository repository;

	@BeforeEach
	void setUp() throws IOException {
		repository = new InMemoryOrderRepository();
		var catalog = new JsonCatalogRepository().loadFromClasspath("catalog.json");
		checkout = new CheckoutService(
				new CatalogPricingService(catalog),
				new ShippingCalculator(6_000),
				repository,
				new OrderRefGenerator(() -> 12345.6789),
				new StubPaymentProvider());
	}

	@Test
	void orderRefMatchesSwagPattern() {
		var result = checkout.checkout(paxiOrder());
		assertThat(result.ref()).matches("^SWAG-[0-9A-Z]{6}$");
	}

	@Test
	void persistsCreatedOrderWithTotals() {
		var result = checkout.checkout(paxiOrder());
		var saved = repository.findByRef(result.ref()).orElseThrow();
		assertThat(saved.status()).isEqualTo(OrderStatus.CREATED);
		assertThat(saved.subtotalCents()).isEqualTo(35_000);
		assertThat(saved.shippingCents()).isEqualTo(6_000);
		assertThat(saved.totalCents()).isEqualTo(41_000);
		assertThat(saved.currency()).isEqualTo("ZAR");
	}

	private CheckoutCommand paxiOrder() {
		return new CheckoutCommand(
				"Marcus",
				"marcus@example.com",
				"0820000000",
				java.util.List.of(new LineRequest("express-dispatch-black", "M", 1)),
				ShipMethod.PAXI_COLLECT,
				"PEP123",
				"PEP Store",
				"1 Main Rd",
				null);
	}
}
