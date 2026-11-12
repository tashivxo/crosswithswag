package za.co.crosswithswag.api.application.mail;

public interface MailPort {

	void send(MailMessage message);

	record MailMessage(String to, String subject, String body, String attachmentCsv) {
	}
}
