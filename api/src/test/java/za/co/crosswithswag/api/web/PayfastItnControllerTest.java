package za.co.crosswithswag.api.web;

import static org.mockito.ArgumentMatchers.anyMap;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import za.co.crosswithswag.api.application.payfast.PayfastItnService;
import za.co.crosswithswag.api.application.payment.PaymentProvider;

@WebMvcTest(PayfastItnController.class)
class PayfastItnControllerTest {

	@Autowired
	private MockMvc mockMvc;

	@MockBean
	private PayfastItnService itnService;

	@Test
	void acceptsFormItn() throws Exception {
		when(itnService.handle(anyMap())).thenReturn(PaymentProvider.ItnVerdict.PAID);

		mockMvc.perform(post("/v1/payfast/itn")
						.contentType(MediaType.APPLICATION_FORM_URLENCODED)
						.content("m_payment_id=SWAG-ABC123&payment_status=COMPLETE&amount_gross=410.00"))
				.andExpect(status().isOk());
	}
}
