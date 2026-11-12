package za.co.crosswithswag.api.config;

import java.io.IOException;
import java.nio.file.Path;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import za.co.crosswithswag.api.application.checkout.CheckoutService;
import za.co.crosswithswag.api.application.checkout.ShippingCalculator;
import za.co.crosswithswag.api.application.mail.MailPort;
import za.co.crosswithswag.api.application.mail.RecordingMailPort;
import za.co.crosswithswag.api.application.order.OrderRefGenerator;
import za.co.crosswithswag.api.application.order.OrderRepository;
import za.co.crosswithswag.api.application.payfast.PayfastItnService;
import za.co.crosswithswag.api.application.payfast.PayfastProperties;
import za.co.crosswithswag.api.application.payment.PaymentProvider;
import za.co.crosswithswag.api.domain.catalog.Catalog;
import za.co.crosswithswag.api.domain.catalog.CatalogPricingService;
import za.co.crosswithswag.api.infrastructure.catalog.JsonCatalogRepository;
import za.co.crosswithswag.api.infrastructure.payfast.PayfastPaymentProvider;
import za.co.crosswithswag.api.infrastructure.payfast.PayfastSignature;

@Configuration
public class ShopConfiguration {

	@Bean
	Catalog catalog(@Value("${app.catalog-path}") String catalogPath) throws IOException {
		return new JsonCatalogRepository(Path.of(catalogPath)).load();
	}

	@Bean
	CatalogPricingService catalogPricingService(Catalog catalog) {
		return new CatalogPricingService(catalog);
	}

	@Bean
	ShippingCalculator shippingCalculator(@Value("${app.shipping.paxi-cents}") int paxiCents) {
		return new ShippingCalculator(paxiCents);
	}

	@Bean
	OrderRefGenerator orderRefGenerator() {
		return new OrderRefGenerator(Math::random);
	}

	@Bean
	CheckoutService checkoutService(
			Catalog catalog,
			CatalogPricingService pricing,
			ShippingCalculator shippingCalculator,
			OrderRepository orderRepository,
			OrderRefGenerator refGenerator,
			PaymentProvider paymentProvider) {
		return new CheckoutService(
				catalog, pricing, shippingCalculator, orderRepository, refGenerator, paymentProvider);
	}

	@Bean
	PayfastProperties payfastProperties(
			@Value("${app.payfast.merchant-id}") String merchantId,
			@Value("${app.payfast.merchant-key}") String merchantKey,
			@Value("${app.payfast.passphrase}") String passphrase,
			@Value("${app.payfast.sandbox}") boolean sandbox,
			@Value("${app.payfast.return-url}") String returnUrl,
			@Value("${app.payfast.cancel-url}") String cancelUrl,
			@Value("${app.payfast.notify-url}") String notifyUrl) {
		return new PayfastProperties(
				merchantId, merchantKey, passphrase, sandbox, returnUrl, cancelUrl, notifyUrl);
	}

	@Bean
	PayfastSignature payfastSignature() {
		return new PayfastSignature();
	}

	@Bean
	PaymentProvider paymentProvider(
			PayfastProperties properties, PayfastSignature signature, OrderRepository orderRepository) {
		return new PayfastPaymentProvider(properties, signature, orderRepository);
	}

	@Bean
	PayfastItnService payfastItnService(
			OrderRepository orderRepository, PaymentProvider paymentProvider, MailPort mailPort) {
		return new PayfastItnService(orderRepository, paymentProvider, mailPort);
	}

	@Bean
	MailPort mailPort(@Value("${app.mail.resend-api-key:}") String resendApiKey) {
		if (resendApiKey == null || resendApiKey.isBlank()) {
			return new RecordingMailPort();
		}
		return new RecordingMailPort();
	}
}
