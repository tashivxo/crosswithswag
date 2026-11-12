package za.co.crosswithswag.api.web;

import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;
import za.co.crosswithswag.api.application.checkout.CheckoutCommand;
import za.co.crosswithswag.api.application.checkout.CheckoutException;
import za.co.crosswithswag.api.application.checkout.CheckoutFacade;
import za.co.crosswithswag.api.domain.catalog.LineRequest;
import za.co.crosswithswag.api.domain.order.ShipMethod;
import za.co.crosswithswag.api.web.dto.CheckoutRequest;
import za.co.crosswithswag.api.web.dto.CheckoutResponse;

@RestController
@RequestMapping("/v1")
public class CheckoutController {

	private final CheckoutFacade checkoutFacade;

	public CheckoutController(CheckoutFacade checkoutFacade) {
		this.checkoutFacade = checkoutFacade;
	}

	@PostMapping("/checkout")
	public ResponseEntity<CheckoutResponse> checkout(@Valid @RequestBody CheckoutRequest request) {
		List<LineRequest> lines = request.lines().stream()
				.map(l -> new LineRequest(l.sku(), l.size(), l.qty()))
				.toList();
		ShipMethod shipMethod;
		try {
			shipMethod = ShipMethod.valueOf(request.shipMethod());
		} catch (IllegalArgumentException ex) {
			throw new CheckoutException("shipMethod must be PAXI_COLLECT or PRIVATE_SHIP");
		}
		var command = new CheckoutCommand(
				request.name(),
				request.email(),
				request.phone(),
				lines,
				shipMethod,
				request.paxiCode(),
				request.paxiName(),
				request.paxiAddress(),
				request.addressText());
		var result = checkoutFacade.checkout(command);
		return ResponseEntity.ok(new CheckoutResponse(result.ref(), result.redirectUrl(), result.vendorFields()));
	}
}
