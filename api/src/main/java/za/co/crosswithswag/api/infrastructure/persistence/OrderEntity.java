package za.co.crosswithswag.api.infrastructure.persistence;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "orders")
public class OrderEntity {

	@Id
	private UUID id;

	@Column(nullable = false, unique = true)
	private String ref;

	@Column(nullable = false)
	private String status;

	@Column(nullable = false)
	private String email;

	@Column(nullable = false)
	private String name;

	private String phone;

	@Column(name = "ship_method", nullable = false)
	private String shipMethod;

	@Column(name = "paxi_code")
	private String paxiCode;

	@Column(name = "paxi_name")
	private String paxiName;

	@Column(name = "paxi_address")
	private String paxiAddress;

	@Column(name = "address_text")
	private String addressText;

	@Column(name = "subtotal_cents", nullable = false)
	private int subtotalCents;

	@Column(name = "shipping_cents", nullable = false)
	private int shippingCents;

	@Column(name = "total_cents", nullable = false)
	private int totalCents;

	@Column(nullable = false)
	private String currency;

	@Column(name = "payfast_payment_id")
	private String payfastPaymentId;

	@Column(name = "payfast_itn_payload")
	private String payfastItnPayload;

	@Column(name = "created_at", nullable = false)
	private Instant createdAt;

	@Column(name = "updated_at", nullable = false)
	private Instant updatedAt;

	@OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
	private List<OrderLineEntity> lines = new ArrayList<>();

	public UUID getId() {
		return id;
	}

	public void setId(UUID id) {
		this.id = id;
	}

	public String getRef() {
		return ref;
	}

	public void setRef(String ref) {
		this.ref = ref;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getPhone() {
		return phone;
	}

	public void setPhone(String phone) {
		this.phone = phone;
	}

	public String getShipMethod() {
		return shipMethod;
	}

	public void setShipMethod(String shipMethod) {
		this.shipMethod = shipMethod;
	}

	public String getPaxiCode() {
		return paxiCode;
	}

	public void setPaxiCode(String paxiCode) {
		this.paxiCode = paxiCode;
	}

	public String getPaxiName() {
		return paxiName;
	}

	public void setPaxiName(String paxiName) {
		this.paxiName = paxiName;
	}

	public String getPaxiAddress() {
		return paxiAddress;
	}

	public void setPaxiAddress(String paxiAddress) {
		this.paxiAddress = paxiAddress;
	}

	public String getAddressText() {
		return addressText;
	}

	public void setAddressText(String addressText) {
		this.addressText = addressText;
	}

	public int getSubtotalCents() {
		return subtotalCents;
	}

	public void setSubtotalCents(int subtotalCents) {
		this.subtotalCents = subtotalCents;
	}

	public int getShippingCents() {
		return shippingCents;
	}

	public void setShippingCents(int shippingCents) {
		this.shippingCents = shippingCents;
	}

	public int getTotalCents() {
		return totalCents;
	}

	public void setTotalCents(int totalCents) {
		this.totalCents = totalCents;
	}

	public String getCurrency() {
		return currency;
	}

	public void setCurrency(String currency) {
		this.currency = currency;
	}

	public String getPayfastPaymentId() {
		return payfastPaymentId;
	}

	public void setPayfastPaymentId(String payfastPaymentId) {
		this.payfastPaymentId = payfastPaymentId;
	}

	public String getPayfastItnPayload() {
		return payfastItnPayload;
	}

	public void setPayfastItnPayload(String payfastItnPayload) {
		this.payfastItnPayload = payfastItnPayload;
	}

	public Instant getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(Instant createdAt) {
		this.createdAt = createdAt;
	}

	public Instant getUpdatedAt() {
		return updatedAt;
	}

	public void setUpdatedAt(Instant updatedAt) {
		this.updatedAt = updatedAt;
	}

	public List<OrderLineEntity> getLines() {
		return lines;
	}

	public void setLines(List<OrderLineEntity> lines) {
		this.lines = lines;
	}
}
