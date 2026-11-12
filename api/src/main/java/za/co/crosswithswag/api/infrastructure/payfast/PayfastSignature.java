package za.co.crosswithswag.api.infrastructure.payfast;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.net.URLEncoder;
import java.util.Map;
import java.util.TreeMap;

public class PayfastSignature {

	public String sign(Map<String, String> fields, String passphrase) {
		String paramString = buildParamString(fields);
		if (passphrase != null && !passphrase.isBlank()) {
			paramString = paramString + "&passphrase="
					+ urlEncode(passphrase.trim());
		}
		return md5Hex(paramString);
	}

	public boolean verify(Map<String, String> fields, String signature, String passphrase) {
		if (signature == null || signature.isBlank()) {
			return false;
		}
		var withoutSig = new TreeMap<String, String>();
		for (var entry : fields.entrySet()) {
			if (!"signature".equalsIgnoreCase(entry.getKey())) {
				withoutSig.put(entry.getKey(), entry.getValue());
			}
		}
		return sign(withoutSig, passphrase).equalsIgnoreCase(signature.trim());
	}

	private String buildParamString(Map<String, String> fields) {
		Map<String, String> sorted = new TreeMap<>(fields);
		StringBuilder sb = new StringBuilder();
		for (var entry : sorted.entrySet()) {
			if ("signature".equalsIgnoreCase(entry.getKey())) {
				continue;
			}
			String value = entry.getValue();
			if (value == null || value.isBlank()) {
				continue;
			}
			if (!sb.isEmpty()) {
				sb.append('&');
			}
			sb.append(entry.getKey()).append('=').append(urlEncode(value.trim()));
		}
		return sb.toString();
	}

	private static String urlEncode(String value) {
		return URLEncoder.encode(value, StandardCharsets.UTF_8).replace("+", "%20");
	}

	private static String md5Hex(String input) {
		try {
			MessageDigest digest = MessageDigest.getInstance("MD5");
			byte[] hash = digest.digest(input.getBytes(StandardCharsets.UTF_8));
			StringBuilder hex = new StringBuilder();
			for (byte b : hash) {
				hex.append(String.format("%02x", b));
			}
			return hex.toString();
		} catch (NoSuchAlgorithmException ex) {
			throw new IllegalStateException(ex);
		}
	}
}
