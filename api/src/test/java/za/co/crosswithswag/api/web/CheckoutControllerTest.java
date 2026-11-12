package za.co.crosswithswag.api.web;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.Map;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import za.co.crosswithswag.api.application.checkout.CheckoutException;
import za.co.crosswithswag.api.application.checkout.CheckoutFacade;
import za.co.crosswithswag.api.application.checkout.CheckoutResult;

@WebMvcTest(CheckoutController.class)
@Import(GlobalExceptionHandler.class)
class CheckoutControllerTest {

	@Autowired
	private MockMvc mockMvc;

	@MockBean
	private CheckoutFacade checkoutFacade;

	@Test
	void checkoutReturnsPayfastFields() throws Exception {
		when(checkoutFacade.checkout(any())).thenReturn(new CheckoutResult(
				"SWAG-ABC123",
				"https://sandbox.payfast.co.za/eng/process",
				Map.of("m_payment_id", "SWAG-ABC123", "amount", "410.00")));

		mockMvc.perform(post("/v1/checkout")
						.contentType(MediaType.APPLICATION_JSON)
						.content("""
								{
								  "name": "Marcus",
								  "email": "marcus@example.com",
								  "phone": "082",
								  "shipMethod": "PAXI_COLLECT",
								  "paxiCode": "PEP1",
								  "lines": [{"sku": "express-dispatch-black", "size": "M", "qty": 1}]
								}
								"""))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.ref").value("SWAG-ABC123"))
				.andExpect(jsonPath("$.redirectUrl").value("https://sandbox.payfast.co.za/eng/process"))
				.andExpect(jsonPath("$.vendorFields.amount").value("410.00"));
	}

	@Test
	void validationErrorReturns400() throws Exception {
		when(checkoutFacade.checkout(any())).thenThrow(new CheckoutException("paxi_code is required"));

		mockMvc.perform(post("/v1/checkout")
						.contentType(MediaType.APPLICATION_JSON)
						.content("""
								{
								  "name": "Marcus",
								  "email": "marcus@example.com",
								  "phone": "082",
								  "shipMethod": "PAXI_COLLECT",
								  "lines": [{"sku": "express-dispatch-black", "size": "M", "qty": 1}]
								}
								"""))
				.andExpect(status().isBadRequest())
				.andExpect(jsonPath("$.message").value("paxi_code is required"));
	}
}
