package za.co.crosswithswag.api.web.dto;

public record OrderConfirmationResponse(
		String ref, String status, int subtotalCents, int shippingCents, int totalCents, String currency) {
}
