# syntax=docker/dockerfile:1
# Build from repository root: docker compose -f docker-compose.prod.yml build

FROM eclipse-temurin:21-jdk AS build
WORKDIR /workspace

COPY api/mvnw api/mvnw.cmd api/pom.xml ./api/
COPY api/.mvn ./api/.mvn
COPY api/src ./api/src
COPY packages/catalog ./packages/catalog

WORKDIR /workspace/api
RUN chmod +x mvnw && ./mvnw -q -DskipTests package

FROM eclipse-temurin:21-jre-jammy
RUN apt-get update \
  && apt-get install -y --no-install-recommends curl \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY --from=build /workspace/api/target/api-*.jar ./app.jar
COPY packages/catalog/catalog.json ./catalog/catalog.json

ENV APP_CATALOG_PATH=/app/catalog/catalog.json

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=5s --start-period=60s --retries=3 \
  CMD curl -f http://localhost:8080/actuator/health || exit 1

ENTRYPOINT ["java", "-jar", "app.jar"]