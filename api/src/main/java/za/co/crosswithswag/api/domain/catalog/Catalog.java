package za.co.crosswithswag.api.domain.catalog;

import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

public final class Catalog {

	private final Map<String, CatalogProduct> bySku;

	public Catalog(List<CatalogProduct> products) {
		this.bySku = products.stream()
				.collect(Collectors.toUnmodifiableMap(CatalogProduct::sku, Function.identity()));
	}

	public CatalogProduct requireProduct(String sku) {
		var product = bySku.get(sku);
		if (product == null) {
			throw new CatalogException("unknown sku: " + sku);
		}
		return product;
	}
}
