package za.co.crosswithswag.api.application.order;

import za.co.crosswithswag.api.domain.order.OrderStatus;

public record OrderSummary(
		String ref,
		OrderStatus status,
		int subtotalCents,
		int shippingCents,
		int totalCents,
		String currency) {
}
