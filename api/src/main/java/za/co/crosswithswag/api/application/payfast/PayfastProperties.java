package za.co.crosswithswag.api.application.payfast;

public record PayfastProperties(
		String merchantId,
		String merchantKey,
		String passphrase,
		boolean sandbox,
		String returnUrl,
		String cancelUrl,
		String notifyUrl) {

	public String processUrl() {
		return sandbox
				? "https://sandbox.payfast.co.za/eng/process"
				: "https://www.payfast.co.za/eng/process";
	}
}
