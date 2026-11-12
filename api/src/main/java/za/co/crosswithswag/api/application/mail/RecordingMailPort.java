package za.co.crosswithswag.api.application.mail;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class RecordingMailPort implements MailPort {

	private final List<MailMessage> sent = new ArrayList<>();

	@Override
	public void send(MailMessage message) {
		sent.add(message);
	}

	public List<MailMessage> sent() {
		return Collections.unmodifiableList(sent);
	}
}
