package za.co.crosswithswag.api.application.checkout;

import za.co.crosswithswag.api.domain.order.ShipMethod;

public class ShippingCalculator {

	private final int paxiEconomyCents;

	public ShippingCalculator(int paxiEconomyCents) {
		this.paxiEconomyCents = paxiEconomyCents;
	}

	public int shippingCents(ShipMethod method) {
		return switch (method) {
			case PAXI_COLLECT, PAXI_ECONOMY -> paxiEconomyCents;
			case PAXI_SPEED -> 11_000;
			case PAXI_DOOR -> 12_000;
			case PRIVATE_SHIP -> 0;
		};
	}
}