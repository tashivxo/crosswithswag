package za.co.crosswithswag.api.web.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

public record CheckoutLineRequest(
		@NotBlank String sku,
		@NotBlank String size,
		@Min(1) int qty) {
}
