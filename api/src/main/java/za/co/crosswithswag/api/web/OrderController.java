package za.co.crosswithswag.api.web;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import za.co.crosswithswag.api.application.order.OrderQueryService;
import za.co.crosswithswag.api.web.dto.OrderConfirmationResponse;

@RestController
@RequestMapping("/v1/orders")
public class OrderController {

	private final OrderQueryService orderQueryService;

	public OrderController(OrderQueryService orderQueryService) {
		this.orderQueryService = orderQueryService;
	}

	@GetMapping("/{ref}")
	public ResponseEntity<OrderConfirmationResponse> getOrder(
			@PathVariable String ref, @RequestParam String email) {
		return orderQueryService
				.findForConfirmation(ref, email)
				.map(summary -> ResponseEntity.ok(new OrderConfirmationResponse(
						summary.ref(),
						summary.status().name(),
						summary.subtotalCents(),
						summary.shippingCents(),
						summary.totalCents(),
						summary.currency())))
				.orElse(ResponseEntity.notFound().build());
	}
}
