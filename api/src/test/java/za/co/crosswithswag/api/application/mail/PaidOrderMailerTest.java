package za.co.crosswithswag.api.application.mail;

import static org.assertj.core.api.Assertions.assertThat;

import java.time.Instant;
import java.util.List;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import za.co.crosswithswag.api.domain.order.Order;
import za.co.crosswithswag.api.domain.order.OrderLine;
import za.co.crosswithswag.api.domain.order.OrderStatus;
import za.co.crosswithswag.api.domain.order.ShipMethod;

class PaidOrderMailerTest {

	@Test
	void csvIncludesLineAndGuest() {
		Order order = order();
		String csv = PaidOrderMailer.csv(order);
		assertThat(csv).startsWith("ref,email,name,phone,ship_method,");
		assertThat(csv).contains("SWAG-MAIL1");
		assertThat(csv).contains("express-dispatch-black,M,1,35000");
	}

	@Test
	void sendsBuyerAndStaff() {
		RecordingMailPort port = new RecordingMailPort();
		new PaidOrderMailer(port, "orders@crosswithswag.co.za").sendPaidMails(order());
		assertThat(port.sent()).hasSize(2);
		assertThat(port.sent().get(0).to()).isEqualTo("buyer@example.com");
		assertThat(port.sent().get(1).to()).isEqualTo("orders@crosswithswag.co.za");
		assertThat(port.sent().get(1).attachmentCsv()).contains("SWAG-MAIL1");
	}

	private static Order order() {
		Instant now = Instant.now();
		return new Order(
				UUID.randomUUID(),
				"SWAG-MAIL1",
				OrderStatus.PAID,
				"buyer@example.com",
				"Buyer",
				"082",
				ShipMethod.PAXI_COLLECT,
				"PEP1",
				"Sea Point",
				"Main Rd",
				null,
				35_000,
				6_000,
				41_000,
				"ZAR",
				List.of(new OrderLine("express-dispatch-black", "M", 1, 35_000, "PRODUCT EXPRESS", "black")),
				now,
				now);
	}
}
