package com.medical.ai.repository;

import com.medical.ai.entity.SysUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * 用户数据访问层
 */
@Repository
public interface SysUserRepository extends JpaRepository<SysUser, Long> {
    
    Optional<SysUser> findByUsernameAndTenantIdAndDeletedAtIsNull(String username, Long tenantId);
    
    Optional<SysUser> findByUsernameAndDeletedAtIsNull(String username);
    
    boolean existsByUsernameAndTenantId(String username, Long tenantId);
    
    Optional<SysUser> findByEmailAndDeletedAtIsNull(String email);
}
