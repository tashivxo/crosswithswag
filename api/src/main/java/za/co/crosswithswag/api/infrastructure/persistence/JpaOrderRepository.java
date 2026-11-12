package za.co.crosswithswag.api.infrastructure.persistence;

import java.util.Optional;
import java.util.UUID;
import org.springframework.stereotype.Repository;
import za.co.crosswithswag.api.application.order.OrderRepository;
import za.co.crosswithswag.api.domain.order.Order;
import za.co.crosswithswag.api.domain.order.OrderLine;
import za.co.crosswithswag.api.domain.order.OrderStatus;
import za.co.crosswithswag.api.domain.order.ShipMethod;

@Repository
public class JpaOrderRepository implements OrderRepository {

	private final SpringDataOrderRepository delegate;

	public JpaOrderRepository(SpringDataOrderRepository delegate) {
		this.delegate = delegate;
	}

	@Override
	public Order save(Order order) {
		OrderEntity entity = delegate.findByRef(order.ref()).orElseGet(OrderEntity::new);
		mapToEntity(order, entity);
		OrderEntity saved = delegate.save(entity);
		return mapToDomain(saved);
	}

	@Override
	public Optional<Order> findByRef(String ref) {
		return delegate.findByRef(ref).map(this::mapToDomain);
	}

	@Override
	public Optional<Order> findByRefAndEmail(String ref, String email) {
		return delegate.findByRefAndEmailIgnoreCase(ref, email).map(this::mapToDomain);
	}

	private void mapToEntity(Order order, OrderEntity entity) {
		entity.setId(order.id());
		entity.setRef(order.ref());
		entity.setStatus(order.status().name());
		entity.setEmail(order.email());
		entity.setName(order.name());
		entity.setPhone(order.phone());
		entity.setShipMethod(order.shipMethod().name());
		entity.setPaxiCode(order.paxiCode());
		entity.setPaxiName(order.paxiName());
		entity.setPaxiAddress(order.paxiAddress());
		entity.setAddressText(order.addressText());
		entity.setSubtotalCents(order.subtotalCents());
		entity.setShippingCents(order.shippingCents());
		entity.setTotalCents(order.totalCents());
		entity.setCurrency(order.currency());
		entity.setCreatedAt(order.createdAt());
		entity.setUpdatedAt(order.updatedAt());
		entity.setPayfastPaymentId(order.payfastPaymentId());
		if (order.payfastItnPayload() != null) {
			entity.setPayfastItnPayload(order.payfastItnPayload());
		}
		if (entity.getLines().isEmpty()) {
			for (OrderLine line : order.lines()) {
				OrderLineEntity lineEntity = new OrderLineEntity();
				lineEntity.setId(UUID.randomUUID());
				lineEntity.setOrder(entity);
				lineEntity.setSku(line.sku());
				lineEntity.setSize(line.size());
				lineEntity.setQty(line.qty());
				lineEntity.setUnitPriceCents(line.unitPriceCents());
				lineEntity.setProductName(line.productName());
				lineEntity.setColourwayName(line.colourwayName());
				lineEntity.setCreatedAt(order.createdAt());
				entity.getLines().add(lineEntity);
			}
		}
	}

	private Order mapToDomain(OrderEntity entity) {
		var lines = entity.getLines().stream()
				.map(l -> new OrderLine(
						l.getSku(),
						l.getSize(),
						l.getQty(),
						l.getUnitPriceCents(),
						l.getProductName(),
						l.getColourwayName()))
				.toList();
		Order order = new Order(
				entity.getId(),
				entity.getRef(),
				OrderStatus.valueOf(entity.getStatus()),
				entity.getEmail(),
				entity.getName(),
				entity.getPhone(),
				ShipMethod.valueOf(entity.getShipMethod()),
				entity.getPaxiCode(),
				entity.getPaxiName(),
				entity.getPaxiAddress(),
				entity.getAddressText(),
				entity.getSubtotalCents(),
				entity.getShippingCents(),
				entity.getTotalCents(),
				entity.getCurrency(),
				lines,
				entity.getCreatedAt(),
				entity.getUpdatedAt());
		if (order.status() == OrderStatus.PAID && entity.getPayfastPaymentId() != null) {
			order.markPaid(entity.getPayfastPaymentId(), entity.getPayfastItnPayload(), entity.getUpdatedAt());
		}
		return order;
	}
}
