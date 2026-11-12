package za.co.crosswithswag.api.infrastructure.mail;

import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Base64;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.MediaType;
import org.springframework.web.client.RestClient;
import za.co.crosswithswag.api.application.mail.MailPort;

public class ResendMailPort implements MailPort {

	private static final Logger log = LoggerFactory.getLogger(ResendMailPort.class);

	private final RestClient client;
	private final String from;

	public ResendMailPort(RestClient.Builder builder, String apiKey, String from) {
		this.client = builder
				.baseUrl("https://api.resend.com")
				.defaultHeader("Authorization", "Bearer " + apiKey)
				.build();
		this.from = from;
	}

	ResendMailPort(RestClient client, String from) {
		this.client = client;
		this.from = from;
	}

	@Override
	public void send(MailMessage message) {
		Map<String, Object> body = new LinkedHashMap<>();
		body.put("from", from);
		body.put("to", List.of(message.to()));
		body.put("subject", message.subject());
		body.put("text", message.body());
		if (message.attachmentCsv() != null && !message.attachmentCsv().isBlank()) {
			List<Map<String, String>> attachments = new ArrayList<>();
			attachments.add(Map.of(
					"filename", "order.csv",
					"content", Base64.getEncoder()
							.encodeToString(message.attachmentCsv().getBytes(StandardCharsets.UTF_8))));
			body.put("attachments", attachments);
		}
		try {
			client.post()
					.uri("/emails")
					.contentType(MediaType.APPLICATION_JSON)
					.body(body)
					.retrieve()
					.toBodilessEntity();
		} catch (RuntimeException ex) {
			log.error("Resend send failed to={} subject={}", message.to(), message.subject(), ex);
			throw ex;
		}
	}
}
