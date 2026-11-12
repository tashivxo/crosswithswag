package za.co.crosswithswag.api.domain.order;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public class Order {

	private final UUID id;
	private final String ref;
	private OrderStatus status;
	private final String email;
	private final String name;
	private final String phone;
	private final ShipMethod shipMethod;
	private final String paxiCode;
	private final String paxiName;
	private final String paxiAddress;
	private final String addressText;
	private final int subtotalCents;
	private final int shippingCents;
	private final int totalCents;
	private final String currency;
	private String payfastPaymentId;
	private String payfastItnPayload;
	private final List<OrderLine> lines;
	private final Instant createdAt;
	private Instant updatedAt;

	public Order(
			UUID id,
			String ref,
			OrderStatus status,
			String email,
			String name,
			String phone,
			ShipMethod shipMethod,
			String paxiCode,
			String paxiName,
			String paxiAddress,
			String addressText,
			int subtotalCents,
			int shippingCents,
			int totalCents,
			String currency,
			List<OrderLine> lines,
			Instant createdAt,
			Instant updatedAt) {
		this.id = id;
		this.ref = ref;
		this.status = status;
		this.email = email;
		this.name = name;
		this.phone = phone;
		this.shipMethod = shipMethod;
		this.paxiCode = paxiCode;
		this.paxiName = paxiName;
		this.paxiAddress = paxiAddress;
		this.addressText = addressText;
		this.subtotalCents = subtotalCents;
		this.shippingCents = shippingCents;
		this.totalCents = totalCents;
		this.currency = currency;
		this.lines = new ArrayList<>(lines);
		this.createdAt = createdAt;
		this.updatedAt = updatedAt;
	}

	public UUID id() {
		return id;
	}

	public String ref() {
		return ref;
	}

	public OrderStatus status() {
		return status;
	}

	public String email() {
		return email;
	}

	public String name() {
		return name;
	}

	public String phone() {
		return phone;
	}

	public ShipMethod shipMethod() {
		return shipMethod;
	}

	public String paxiCode() {
		return paxiCode;
	}

	public String paxiName() {
		return paxiName;
	}

	public String paxiAddress() {
		return paxiAddress;
	}

	public String addressText() {
		return addressText;
	}

	public int subtotalCents() {
		return subtotalCents;
	}

	public int shippingCents() {
		return shippingCents;
	}

	public int totalCents() {
		return totalCents;
	}

	public String currency() {
		return currency;
	}

	public List<OrderLine> lines() {
		return List.copyOf(lines);
	}

	public Instant createdAt() {
		return createdAt;
	}

	public Instant updatedAt() {
		return updatedAt;
	}

	public String payfastPaymentId() {
		return payfastPaymentId;
	}

	public String payfastItnPayload() {
		return payfastItnPayload;
	}

	public void markPaid(String paymentId, String itnPayload, Instant now) {
		this.status = OrderStatus.PAID;
		this.payfastPaymentId = paymentId;
		this.payfastItnPayload = itnPayload;
		this.updatedAt = now;
	}

	public void setStatus(OrderStatus status, Instant now) {
		this.status = status;
		this.updatedAt = now;
	}
}
