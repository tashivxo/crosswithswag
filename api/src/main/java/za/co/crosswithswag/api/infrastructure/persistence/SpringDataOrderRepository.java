package za.co.crosswithswag.api.infrastructure.persistence;

import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SpringDataOrderRepository extends JpaRepository<OrderEntity, UUID> {

	Optional<OrderEntity> findByRef(String ref);

	Optional<OrderEntity> findByRefAndEmailIgnoreCase(String ref, String email);
}
