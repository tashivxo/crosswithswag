package za.co.crosswithswag.api.application.order;

import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import za.co.crosswithswag.api.domain.order.Order;

public class InMemoryOrderRepository implements OrderRepository {

	private final Map<String, Order> byRef = new ConcurrentHashMap<>();

	@Override
	public Order save(Order order) {
		byRef.put(order.ref(), order);
		return order;
	}

	@Override
	public Optional<Order> findByRef(String ref) {
		return Optional.ofNullable(byRef.get(ref));
	}

	@Override
	public Optional<Order> findByRefAndEmail(String ref, String email) {
		return findByRef(ref).filter(o -> o.email().equalsIgnoreCase(email));
	}
}
