package za.co.crosswithswag.api.domain.order;

public record OrderLine(
		String sku,
		String size,
		int qty,
		int unitPriceCents,
		String productName,
		String colourwayName) {
}
