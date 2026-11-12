package za.co.crosswithswag.api.infrastructure.catalog;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.List;
import za.co.crosswithswag.api.domain.catalog.Catalog;
import za.co.crosswithswag.api.domain.catalog.CatalogProduct;
import za.co.crosswithswag.api.domain.catalog.CatalogSize;

public class JsonCatalogRepository {

	private static final ObjectMapper MAPPER = new ObjectMapper();

	private final Path filePath;

	public JsonCatalogRepository() {
		this.filePath = null;
	}

	public JsonCatalogRepository(Path filePath) {
		this.filePath = filePath;
	}

	public Catalog load() throws IOException {
		if (filePath == null) {
			throw new IllegalStateException("file path not configured");
		}
		try (InputStream in = Files.newInputStream(filePath)) {
			return parse(in);
		}
	}

	public Catalog loadFromClasspath(String resourceName) throws IOException {
		try (InputStream in = getClass().getClassLoader().getResourceAsStream(resourceName)) {
			if (in == null) {
				throw new IOException("catalog resource not found: " + resourceName);
			}
			return parse(in);
		}
	}

	private Catalog parse(InputStream in) throws IOException {
		JsonNode root = MAPPER.readTree(in);
		List<CatalogProduct> products = new ArrayList<>();
		for (JsonNode node : root.get("products")) {
			List<CatalogSize> sizes = new ArrayList<>();
			for (JsonNode sizeNode : node.get("sizes")) {
				sizes.add(new CatalogSize(
						sizeNode.get("code").asText(),
						sizeNode.get("offered").asBoolean()));
			}
			products.add(new CatalogProduct(
					node.get("sku").asText(),
					node.path("shirtName").asText(""),
					node.path("colourwayName").asText(""),
					node.get("price_cents").asInt(),
					List.copyOf(sizes)));
		}
		return new Catalog(products);
	}
}
