package za.co.crosswithswag.api.domain.catalog;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import java.io.IOException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import za.co.crosswithswag.api.infrastructure.catalog.JsonCatalogRepository;

class CatalogPricingServiceTest {

	private CatalogPricingService pricing;

	@BeforeEach
	void setUp() throws IOException {
		var loader = new JsonCatalogRepository();
		pricing = new CatalogPricingService(loader.loadFromClasspath("catalog.json"));
	}

	@Test
	void pricesKnownSkuFromCatalogNotClient() {
		assertThat(pricing.unitPriceCents("express-dispatch-white", "M")).isEqualTo(35_000);
	}

	@Test
	void rejectsUnknownSku() {
		assertThatThrownBy(() -> pricing.unitPriceCents("no-such-sku", "M"))
				.isInstanceOf(CatalogException.class)
				.hasMessageContaining("unknown sku");
	}

	@Test
	void rejectsUnofferedSize() {
		assertThatThrownBy(() -> pricing.unitPriceCents("express-dispatch-black", "3XL"))
				.isInstanceOf(CatalogException.class)
				.hasMessageContaining("not offered");
	}

	@Test
	void subtotalSumsCatalogPrices() {
		var lines = java.util.List.of(
				new LineRequest("express-dispatch-black", "M", 2),
				new LineRequest("halo-orbit-pink", "L", 1));
		assertThat(pricing.subtotalCents(lines)).isEqualTo(35_000 * 3);
	}
}
