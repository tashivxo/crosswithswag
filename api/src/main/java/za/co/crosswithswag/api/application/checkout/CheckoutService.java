package za.co.crosswithswag.api.application.checkout;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import za.co.crosswithswag.api.application.order.OrderRefGenerator;
import za.co.crosswithswag.api.application.order.OrderRepository;
import za.co.crosswithswag.api.application.payment.PaymentProvider;
import za.co.crosswithswag.api.domain.catalog.Catalog;
import za.co.crosswithswag.api.domain.catalog.CatalogException;
import za.co.crosswithswag.api.domain.catalog.CatalogPricingService;
import za.co.crosswithswag.api.domain.catalog.LineRequest;
import za.co.crosswithswag.api.domain.order.Order;
import za.co.crosswithswag.api.domain.order.OrderLine;
import za.co.crosswithswag.api.domain.order.OrderStatus;
import za.co.crosswithswag.api.domain.order.ShipMethod;

public class CheckoutService {

	private static final Logger log = LoggerFactory.getLogger(CheckoutService.class);

	private final Catalog catalog;
	private final CatalogPricingService pricing;
	private final ShippingCalculator shippingCalculator;
	private final OrderRepository orderRepository;
	private final OrderRefGenerator refGenerator;
	private final PaymentProvider paymentProvider;

	public CheckoutService(
			Catalog catalog,
			CatalogPricingService pricing,
			ShippingCalculator shippingCalculator,
			OrderRepository orderRepository,
			OrderRefGenerator refGenerator,
			PaymentProvider paymentProvider) {
		this.catalog = catalog;
		this.pricing = pricing;
		this.shippingCalculator = shippingCalculator;
		this.orderRepository = orderRepository;
		this.refGenerator = refGenerator;
		this.paymentProvider = paymentProvider;
	}

	public CheckoutService(
			CatalogPricingService pricing,
			ShippingCalculator shippingCalculator,
			OrderRepository orderRepository,
			OrderRefGenerator refGenerator,
			PaymentProvider paymentProvider) {
		this(null, pricing, shippingCalculator, orderRepository, refGenerator, paymentProvider);
	}

	public CheckoutResult checkout(CheckoutCommand command) {
		validateShipping(command);
		int subtotal;
		try {
			subtotal = pricing.subtotalCents(command.lines());
		} catch (CatalogException ex) {
			throw new CheckoutException(ex.getMessage());
		}
		int shipping = shippingCalculator.shippingCents(command.shipMethod());
		int total = subtotal + shipping;
		List<OrderLine> lines = buildLines(command.lines());
		Instant now = Instant.now();
		String ref = refGenerator.nextRef();
		Order order = new Order(
				UUID.randomUUID(),
				ref,
				OrderStatus.CREATED,
				command.email(),
				command.name(),
				command.phone(),
				command.shipMethod(),
				command.paxiCode(),
				command.paxiName(),
				command.paxiAddress(),
				command.addressText(),
				subtotal,
				shipping,
				total,
				"ZAR",
				lines,
				now,
				now);
		orderRepository.save(order);
		log.info("checkout created order ref={} totalCents={}", ref, total);
		try {
			return paymentProvider.createCheckout(order);
		} catch (IllegalStateException ex) {
			throw new CheckoutException(ex.getMessage());
		}
	}

	private void validateShipping(CheckoutCommand command) {
		ShipMethod method = command.shipMethod();
		if (isPaxiPickup(method)
				&& (command.paxiCode() == null || command.paxiCode().isBlank())) {
			throw new CheckoutException("paxi_code is required for paxi collect");
		}
		if (needsAddress(method)
				&& (command.addressText() == null || command.addressText().isBlank())) {
			throw new CheckoutException("address is required for this delivery option");
		}
		for (LineRequest line : command.lines()) {
			if (line.qty() < 1) {
				throw new CheckoutException("qty must be at least 1");
			}
		}
	}

	private static boolean isPaxiPickup(ShipMethod method) {
		return method == ShipMethod.PAXI_COLLECT
				|| method == ShipMethod.PAXI_ECONOMY
				|| method == ShipMethod.PAXI_SPEED;
	}

	private static boolean needsAddress(ShipMethod method) {
		return method == ShipMethod.PAXI_DOOR || method == ShipMethod.PRIVATE_SHIP;
	}

	private List<OrderLine> buildLines(List<LineRequest> requests) {
		List<OrderLine> lines = new ArrayList<>();
		for (LineRequest req : requests) {
			int unit = pricing.unitPriceCents(req.sku(), req.size());
			String productName = "";
			String colourway = "";
			if (catalog != null) {
				var product = catalog.requireProduct(req.sku());
				productName = product.shirtName();
				colourway = product.colourwayName();
			}
			lines.add(new OrderLine(req.sku(), req.size(), req.qty(), unit, productName, colourway));
		}
		return lines;
	}
}
