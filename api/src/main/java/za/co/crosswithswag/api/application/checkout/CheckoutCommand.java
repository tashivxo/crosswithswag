package za.co.crosswithswag.api.application.checkout;

import java.util.List;
import za.co.crosswithswag.api.domain.catalog.LineRequest;
import za.co.crosswithswag.api.domain.order.ShipMethod;

public record CheckoutCommand(
		String name,
		String email,
		String phone,
		List<LineRequest> lines,
		ShipMethod shipMethod,
		String paxiCode,
		String paxiName,
		String paxiAddress,
		String addressText) {

	public CheckoutCommand withPaxiCode(String paxiCode) {
		return new CheckoutCommand(
				name, email, phone, lines, shipMethod, paxiCode, paxiName, paxiAddress, addressText);
	}

	public CheckoutCommand withAddressText(String addressText) {
		return new CheckoutCommand(
				name, email, phone, lines, shipMethod, paxiCode, paxiName, paxiAddress, addressText);
	}

	public CheckoutCommand withLines(List<LineRequest> lines) {
		return new CheckoutCommand(
				name, email, phone, lines, shipMethod, paxiCode, paxiName, paxiAddress, addressText);
	}
}
