package za.co.crosswithswag.api.application.checkout;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CheckoutFacade {

	private final CheckoutService checkoutService;

	public CheckoutFacade(CheckoutService checkoutService) {
		this.checkoutService = checkoutService;
	}

	@Transactional
	public CheckoutResult checkout(CheckoutCommand command) {
		return checkoutService.checkout(command);
	}
}
