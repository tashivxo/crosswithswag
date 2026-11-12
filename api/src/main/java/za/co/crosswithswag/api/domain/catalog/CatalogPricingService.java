package za.co.crosswithswag.api.domain.catalog;

import java.util.List;

public class CatalogPricingService {

	private final Catalog catalog;

	public CatalogPricingService(Catalog catalog) {
		this.catalog = catalog;
	}

	public int unitPriceCents(String sku, String size) {
		var product = catalog.requireProduct(sku);
		product.requireSize(size);
		return product.priceCents();
	}

	public int subtotalCents(List<LineRequest> lines) {
		int sum = 0;
		for (var line : lines) {
			if (line.qty() < 1) {
				throw new CatalogException("qty must be at least 1");
			}
			sum += unitPriceCents(line.sku(), line.size()) * line.qty();
		}
		return sum;
	}
}
