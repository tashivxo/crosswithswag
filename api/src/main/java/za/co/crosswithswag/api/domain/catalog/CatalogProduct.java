package za.co.crosswithswag.api.domain.catalog;

import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

public record CatalogProduct(
		String sku,
		String shirtName,
		String colourwayName,
		int priceCents,
		List<CatalogSize> sizes) {

	public CatalogSize requireSize(String sizeCode) {
		Map<String, CatalogSize> byCode = sizes.stream()
				.collect(Collectors.toMap(CatalogSize::code, Function.identity()));
		var size = byCode.get(sizeCode);
		if (size == null) {
			throw new CatalogException("unknown size " + sizeCode + " for sku " + sku);
		}
		if (!size.offered()) {
			throw new CatalogException("size not offered: " + sizeCode + " for sku " + sku);
		}
		return size;
	}
}
