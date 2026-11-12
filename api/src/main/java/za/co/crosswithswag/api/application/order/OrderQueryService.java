package za.co.crosswithswag.api.application.order;

import java.util.Optional;
import org.springframework.stereotype.Service;
import za.co.crosswithswag.api.domain.order.Order;

@Service
public class OrderQueryService {

	private final OrderRepository orderRepository;

	public OrderQueryService(OrderRepository orderRepository) {
		this.orderRepository = orderRepository;
	}

	public Optional<OrderSummary> findForConfirmation(String ref, String email) {
		return orderRepository.findByRefAndEmail(ref, email).map(this::toSummary);
	}

	private OrderSummary toSummary(Order order) {
		return new OrderSummary(
				order.ref(),
				order.status(),
				order.subtotalCents(),
				order.shippingCents(),
				order.totalCents(),
				order.currency());
	}
}
