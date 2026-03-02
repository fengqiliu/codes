package com.medical.ai.repository;

import com.medical.ai.entity.AiModel;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * AI模型数据访问层
 */
@Repository
public interface AiModelRepository extends JpaRepository<AiModel, Long> {
    
    Optional<AiModel> findByModelId(String modelId);
    
    boolean existsByModelId(String modelId);
    
    List<AiModel> findByStatus(AiModel.ModelStatus status);
    
    List<AiModel> findByType(AiModel.ModelType type);
    
    List<AiModel> findByTenantId(Long tenantId);
    
    @Query("SELECT m FROM AiModel m WHERE m.tenantId = :tenantId " +
           "AND (:type IS NULL OR m.type = :type) " +
           "AND (:status IS NULL OR m.status = :status) " +
           "AND (:keyword IS NULL OR m.name LIKE %:keyword% OR m.modelId LIKE %:keyword%)")
    Page<AiModel> findByConditions(
            @Param("tenantId") Long tenantId,
            @Param("type") AiModel.ModelType type,
            @Param("status") AiModel.ModelStatus status,
            @Param("keyword") String keyword,
            Pageable pageable);
    
    @Query("SELECT COUNT(m) FROM AiModel m WHERE m.tenantId = :tenantId AND m.status = :status")
    long countByTenantIdAndStatus(@Param("tenantId") Long tenantId, @Param("status") AiModel.ModelStatus status);
}
