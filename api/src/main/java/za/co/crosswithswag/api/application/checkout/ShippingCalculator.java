package za.co.crosswithswag.api.application.checkout;

import za.co.crosswithswag.api.domain.order.ShipMethod;

public class ShippingCalculator {

	private final int paxiCents;

	public ShippingCalculator(int paxiCents) {
		this.paxiCents = paxiCents;
	}

	public int shippingCents(ShipMethod method) {
		return method == ShipMethod.PAXI_COLLECT ? paxiCents : 0;
	}
}
