package za.co.crosswithswag.api.application.checkout;

import java.util.Map;

public record CheckoutResult(String ref, String redirectUrl, Map<String, String> vendorFields) {
}
