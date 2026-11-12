package za.co.crosswithswag.api.application.order;

import java.util.Optional;
import za.co.crosswithswag.api.domain.order.Order;

public interface OrderRepository {

	Order save(Order order);

	Optional<Order> findByRef(String ref);

	Optional<Order> findByRefAndEmail(String ref, String email);
}
