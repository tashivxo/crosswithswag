package za.co.crosswithswag.api.application.order;

import java.util.function.DoubleSupplier;

public class OrderRefGenerator {

	private final DoubleSupplier random;

	public OrderRefGenerator(DoubleSupplier random) {
		this.random = random;
	}

	public String nextRef() {
		long value = (long) Math.floor(random.getAsDouble() * Math.pow(36, 6));
		String raw = Long.toString(value, 36).toUpperCase();
		String padded = ("000000" + raw);
		String code = padded.substring(padded.length() - 6);
		return "SWAG-" + code;
	}
}
