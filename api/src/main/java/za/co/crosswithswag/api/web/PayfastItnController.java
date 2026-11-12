package za.co.crosswithswag.api.web;

import java.util.LinkedHashMap;
import java.util.Map;
import org.springframework.http.ResponseEntity;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import za.co.crosswithswag.api.application.payfast.PayfastItnService;

@RestController
@RequestMapping("/v1/payfast")
public class PayfastItnController {

	private final PayfastItnService itnService;

	public PayfastItnController(PayfastItnService itnService) {
		this.itnService = itnService;
	}

	@PostMapping("/itn")
	public ResponseEntity<Void> itn(@RequestParam MultiValueMap<String, String> form) {
		Map<String, String> params = new LinkedHashMap<>();
		form.forEach((key, values) -> {
			if (!values.isEmpty()) {
				params.put(key, values.getFirst());
			}
		});
		itnService.handle(params);
		return ResponseEntity.ok().build();
	}
}
