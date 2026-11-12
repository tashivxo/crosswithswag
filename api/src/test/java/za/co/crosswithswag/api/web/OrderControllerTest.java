package za.co.crosswithswag.api.web;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;
import za.co.crosswithswag.api.application.order.OrderQueryService;
import za.co.crosswithswag.api.application.order.OrderSummary;
import za.co.crosswithswag.api.domain.order.OrderStatus;

@WebMvcTest(OrderController.class)
class OrderControllerTest {

	@Autowired
	private MockMvc mockMvc;

	@MockBean
	private OrderQueryService orderQueryService;

	@Test
	void returnsOrderWhenEmailMatches() throws Exception {
		when(orderQueryService.findForConfirmation("SWAG-ABC123", "a@example.com"))
				.thenReturn(Optional.of(new OrderSummary(
						"SWAG-ABC123", OrderStatus.PAID, 35_000, 6_000, 41_000, "ZAR")));

		mockMvc.perform(get("/v1/orders/SWAG-ABC123").param("email", "a@example.com"))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.ref").value("SWAG-ABC123"))
				.andExpect(jsonPath("$.status").value("PAID"));
	}

	@Test
	void notFoundWhenEmailMismatch() throws Exception {
		when(orderQueryService.findForConfirmation("SWAG-ABC123", "other@example.com"))
				.thenReturn(Optional.empty());

		mockMvc.perform(get("/v1/orders/SWAG-ABC123").param("email", "other@example.com"))
				.andExpect(status().isNotFound());
	}
}
