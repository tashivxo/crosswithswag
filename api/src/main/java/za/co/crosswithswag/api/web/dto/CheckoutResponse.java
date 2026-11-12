package za.co.crosswithswag.api.web.dto;

import java.util.Map;

public record CheckoutResponse(String ref, String redirectUrl, Map<String, String> vendorFields) {
}
