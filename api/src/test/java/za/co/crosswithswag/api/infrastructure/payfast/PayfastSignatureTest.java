package za.co.crosswithswag.api.infrastructure.payfast;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.LinkedHashMap;
import java.util.Map;
import org.junit.jupiter.api.Test;

class PayfastSignatureTest {

	private final PayfastSignature signature = new PayfastSignature();

	@Test
	void generatesMd5FromAlphabeticalNonBlankFieldsAndPassphrase() {
		Map<String, String> fields = new LinkedHashMap<>();
		fields.put("merchant_id", "10000100");
		fields.put("merchant_key", "46f0cd694581a");
		fields.put("amount", "410.00");
		fields.put("item_name", "SWAG order");
		fields.put("m_payment_id", "SWAG-ABC123");
		fields.put("return_url", "http://localhost:3000/order/confirmed");
		fields.put("cancel_url", "http://localhost:3000/checkout");
		fields.put("notify_url", "http://localhost:8080/v1/payfast/itn");

		String generated = signature.sign(fields, "passphrase123");
		assertThat(generated).isEqualTo(signature.sign(fields, "passphrase123"));
		assertThat(generated).matches("^[a-f0-9]{32}$");
	}

	@Test
	void validFixtureSignatureMatches() {
		Map<String, String> fields = Map.of(
				"m_payment_id", "SWAG-TEST01",
				"pf_payment_id", "1089250",
				"payment_status", "COMPLETE",
				"item_name", "SWAG order",
				"amount_gross", "410.00",
				"merchant_id", "10000100");
		String expected = signature.sign(fields, "testphrase");
		assertThat(signature.verify(fields, expected, "testphrase")).isTrue();
		assertThat(signature.verify(fields, "deadbeefdeadbeefdeadbeefdeadbeef", "testphrase")).isFalse();
	}
}
