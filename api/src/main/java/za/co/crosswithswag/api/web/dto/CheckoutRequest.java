package za.co.crosswithswag.api.web.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public record CheckoutRequest(
		@NotBlank String name,
		@NotBlank @Email String email,
		String phone,
		@NotEmpty @Valid List<CheckoutLineRequest> lines,
		@NotNull String shipMethod,
		String paxiCode,
		String paxiName,
		String paxiAddress,
		String addressText) {
}
