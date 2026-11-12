package za.co.crosswithswag.api.application.mail;

import za.co.crosswithswag.api.domain.order.Order;
import za.co.crosswithswag.api.domain.order.OrderLine;
import za.co.crosswithswag.api.domain.order.ShipMethod;

public class PaidOrderMailer {

	private final MailPort mailPort;
	private final String staffTo;

	public PaidOrderMailer(MailPort mailPort, String staffTo) {
		this.mailPort = mailPort;
		this.staffTo = staffTo;
	}

	public void sendPaidMails(Order order) {
		mailPort.send(new MailPort.MailMessage(
				order.email(),
				"SWAG order " + order.ref(),
				buyerBody(order),
				null));
		mailPort.send(new MailPort.MailMessage(
				staffTo,
				"paid " + order.ref(),
				staffBody(order),
				csv(order)));
	}

	static String buyerBody(Order order) {
		return "we received payment for " + order.ref() + ".\n"
				+ "made to order — we will write again when it ships.";
	}

	static String staffBody(Order order) {
		return order.ref()
				+ "\n"
				+ nullToEmpty(order.name())
				+ " / "
				+ nullToEmpty(order.email())
				+ " / "
				+ nullToEmpty(order.phone())
				+ "\n"
				+ order.shipMethod().name()
				+ "\n"
				+ destination(order);
	}

	static String csv(Order order) {
		StringBuilder sb = new StringBuilder(
				"ref,email,name,phone,ship_method,paxi_code,paxi_name,address,sku,size,qty,unit_price_cents,product,colourway\n");
		for (OrderLine line : order.lines()) {
			sb.append(csvCell(order.ref()))
					.append(',')
					.append(csvCell(order.email()))
					.append(',')
					.append(csvCell(order.name()))
					.append(',')
					.append(csvCell(order.phone()))
					.append(',')
					.append(csvCell(order.shipMethod().name()))
					.append(',')
					.append(csvCell(order.paxiCode()))
					.append(',')
					.append(csvCell(order.paxiName()))
					.append(',')
					.append(csvCell(destination(order)))
					.append(',')
					.append(csvCell(line.sku()))
					.append(',')
					.append(csvCell(line.size()))
					.append(',')
					.append(line.qty())
					.append(',')
					.append(line.unitPriceCents())
					.append(',')
					.append(csvCell(line.productName()))
					.append(',')
					.append(csvCell(line.colourwayName()))
					.append('\n');
		}
		return sb.toString();
	}

	private static String destination(Order order) {
		if (order.shipMethod() == ShipMethod.PAXI_COLLECT) {
			return nullToEmpty(order.paxiCode()) + " " + nullToEmpty(order.paxiName()) + " "
					+ nullToEmpty(order.paxiAddress());
		}
		return nullToEmpty(order.addressText());
	}

	private static String csvCell(String value) {
		String raw = nullToEmpty(value);
		if (raw.indexOf(',') >= 0 || raw.indexOf('"') >= 0 || raw.indexOf('\n') >= 0) {
			return '"' + raw.replace("\"", "\"\"") + '"';
		}
		return raw;
	}

	private static String nullToEmpty(String value) {
		return value == null ? "" : value.trim();
	}
}
