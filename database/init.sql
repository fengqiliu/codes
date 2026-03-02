-- ============================================
-- 医学影像AI集成平台 V2.0 数据库初始化脚本
-- Database: PostgreSQL 16
-- ============================================

-- 创建数据库
-- CREATE DATABASE medical_ai WITH ENCODING 'UTF8' LC_COLLATE 'zh_CN.UTF-8' LC_CTYPE 'zh_CN.UTF-8';

-- 创建扩展
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================
-- 1. 租户表
-- ============================================
CREATE TABLE sys_tenant (
    id BIGSERIAL PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    logo VARCHAR(255),
    contact_name VARCHAR(50),
    contact_phone VARCHAR(20),
    contact_email VARCHAR(100),
    status SMALLINT NOT NULL DEFAULT 1,
    quota JSONB DEFAULT '{"models": 100, "api_calls": 1000000, "storage": 107374182400}'::jsonb,
    expires_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE sys_tenant IS '租户表';
COMMENT ON COLUMN sys_tenant.code IS '租户编码';
COMMENT ON COLUMN sys_tenant.quota IS '资源配额';

-- ============================================
-- 2. 用户表
-- ============================================
CREATE TABLE sys_user (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    real_name VARCHAR(50),
    avatar VARCHAR(255),
    status SMALLINT NOT NULL DEFAULT 1,
    tenant_id BIGINT NOT NULL REFERENCES sys_tenant(id),
    last_login_at TIMESTAMP,
    last_login_ip VARCHAR(50),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMP,
    UNIQUE(username, tenant_id)
);

CREATE INDEX idx_sys_user_username ON sys_user(username);
CREATE INDEX idx_sys_user_tenant ON sys_user(tenant_id);
CREATE INDEX idx_sys_user_status ON sys_user(status) WHERE deleted_at IS NULL;

COMMENT ON TABLE sys_user IS '用户表';
COMMENT ON COLUMN sys_user.password IS 'BCrypt加密密码';
COMMENT ON COLUMN sys_user.status IS '状态:0禁用,1启用';

-- ============================================
-- 3. 角色表
-- ============================================
CREATE TABLE sys_role (
    id BIGSERIAL PRIMARY KEY,
    code VARCHAR(50) NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    status SMALLINT NOT NULL DEFAULT 1,
    tenant_id BIGINT NOT NULL REFERENCES sys_tenant(id),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE(code, tenant_id)
);

COMMENT ON TABLE sys_role IS '角色表';

-- ============================================
-- 4. 权限表
-- ============================================
CREATE TABLE sys_permission (
    id BIGSERIAL PRIMARY KEY,
    code VARCHAR(100) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    resource VARCHAR(50) NOT NULL,
    action VARCHAR(50) NOT NULL,
    description TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE sys_permission IS '权限表';
COMMENT ON COLUMN sys_permission.resource IS '资源类型:model,api,user,system';
COMMENT ON COLUMN sys_permission.action IS '操作类型:read,write,delete,execute';

-- ============================================
-- 5. 用户角色关联表
-- ============================================
CREATE TABLE sys_user_role (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES sys_user(id) ON DELETE CASCADE,
    role_id BIGINT NOT NULL REFERENCES sys_role(id) ON DELETE CASCADE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, role_id)
);

-- ============================================
-- 6. 角色权限关联表
-- ============================================
CREATE TABLE sys_role_permission (
    id BIGSERIAL PRIMARY KEY,
    role_id BIGINT NOT NULL REFERENCES sys_role(id) ON DELETE CASCADE,
    permission_id BIGINT NOT NULL REFERENCES sys_permission(id) ON DELETE CASCADE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE(role_id, permission_id)
);

-- ============================================
-- 7. AI模型表
-- ============================================
CREATE TABLE ai_model (
    id BIGSERIAL PRIMARY KEY,
    model_id VARCHAR(100) NOT NULL UNIQUE,
    name VARCHAR(200) NOT NULL,
    type VARCHAR(50) NOT NULL,
    description TEXT,
    version VARCHAR(50) NOT NULL DEFAULT '1.0.0',
    endpoint VARCHAR(500) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'OFFLINE',
    icon VARCHAR(255),
    tags VARCHAR(500),
    tenant_id BIGINT NOT NULL REFERENCES sys_tenant(id),
    created_by BIGINT NOT NULL REFERENCES sys_user(id),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_model_type CHECK (type IN ('LLM', 'IMAGE', 'VOICE', 'CUSTOM')),
    CONSTRAINT chk_model_status CHECK (status IN ('ONLINE', 'OFFLINE', 'MAINTENANCE'))
);

CREATE INDEX idx_ai_model_type ON ai_model(type);
CREATE INDEX idx_ai_model_status ON ai_model(status);
CREATE INDEX idx_ai_model_tenant ON ai_model(tenant_id);

COMMENT ON TABLE ai_model IS 'AI模型表';
COMMENT ON COLUMN ai_model.model_id IS '模型唯一标识';
COMMENT ON COLUMN ai_model.type IS '模型类型:LLM/IMAGE/VOICE/CUSTOM';
COMMENT ON COLUMN ai_model.status IS '状态:ONLINE/OFFLINE/MAINTENANCE';

-- ============================================
-- 8. 模型配置表
-- ============================================
CREATE TABLE ai_model_config (
    id BIGSERIAL PRIMARY KEY,
    model_id BIGINT NOT NULL REFERENCES ai_model(id) ON DELETE CASCADE,
    config_key VARCHAR(100) NOT NULL,
    config_value TEXT NOT NULL,
    config_type VARCHAR(20) NOT NULL DEFAULT 'STRING',
    description VARCHAR(500),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE(model_id, config_key)
);

COMMENT ON TABLE ai_model_config IS '模型配置表';

-- ============================================
-- 9. 模型版本表
-- ============================================
CREATE TABLE ai_model_version (
    id BIGSERIAL PRIMARY KEY,
    model_id BIGINT NOT NULL REFERENCES ai_model(id) ON DELETE CASCADE,
    version VARCHAR(50) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'INACTIVE',
    endpoint VARCHAR(500),
    release_note TEXT,
    is_default BOOLEAN NOT NULL DEFAULT FALSE,
    published_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE(model_id, version),
    CONSTRAINT chk_version_status CHECK (status IN ('ACTIVE', 'INACTIVE', 'DEPRECATED'))
);

COMMENT ON TABLE ai_model_version IS '模型版本表';

-- ============================================
-- 10. API端点表
-- ============================================
CREATE TABLE api_endpoint (
    id BIGSERIAL PRIMARY KEY,
    path VARCHAR(500) NOT NULL,
    method VARCHAR(10) NOT NULL DEFAULT 'POST',
    name VARCHAR(200) NOT NULL,
    description TEXT,
    model_id BIGINT REFERENCES ai_model(id),
    request_schema JSONB,
    response_schema JSONB,
    rate_limit INTEGER NOT NULL DEFAULT 100,
    timeout INTEGER NOT NULL DEFAULT 30000,
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    version VARCHAR(20) NOT NULL DEFAULT 'v1',
    tenant_id BIGINT NOT NULL REFERENCES sys_tenant(id),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_api_endpoint_path_method ON api_endpoint(path, method, version, tenant_id);
CREATE INDEX idx_api_endpoint_model ON api_endpoint(model_id);

COMMENT ON TABLE api_endpoint IS 'API端点表';
COMMENT ON COLUMN api_endpoint.rate_limit IS 'QPS限制';
COMMENT ON COLUMN api_endpoint.timeout IS '超时时间(ms)';

-- ============================================
-- 11. API密钥表
-- ============================================
CREATE TABLE api_key (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    key VARCHAR(64) NOT NULL UNIQUE,
    secret VARCHAR(128) NOT NULL,
    user_id BIGINT NOT NULL REFERENCES sys_user(id),
    tenant_id BIGINT NOT NULL REFERENCES sys_tenant(id),
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    permissions JSONB DEFAULT '[]'::jsonb,
    rate_limit INTEGER,
    expires_at TIMESTAMP,
    last_used_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_api_key_user ON api_key(user_id);
CREATE INDEX idx_api_key_key ON api_key(key);

COMMENT ON TABLE api_key IS 'API密钥表';

-- ============================================
-- 12. 调用日志表(分区表)
-- ============================================
CREATE TABLE invoke_log (
    id BIGSERIAL,
    request_id VARCHAR(64) NOT NULL,
    trace_id VARCHAR(64),
    model_id BIGINT NOT NULL,
    api_endpoint_id BIGINT,
    api_key_id BIGINT,
    user_id BIGINT,
    tenant_id BIGINT NOT NULL,
    request_body JSONB,
    response_body JSONB,
    status VARCHAR(20) NOT NULL,
    error_code VARCHAR(20),
    error_message TEXT,
    response_time INTEGER NOT NULL,
    client_ip VARCHAR(50),
    user_agent VARCHAR(500),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    PRIMARY KEY (id, created_at)
) PARTITION BY RANGE (created_at);

CREATE INDEX idx_invoke_log_request_id ON invoke_log(request_id);
CREATE INDEX idx_invoke_log_model ON invoke_log(model_id, created_at);
CREATE INDEX idx_invoke_log_tenant ON invoke_log(tenant_id, created_at);
CREATE INDEX idx_invoke_log_status ON invoke_log(status, created_at);

COMMENT ON TABLE invoke_log IS 'AI调用日志表(按月分区)';

-- 创建2026年分区
CREATE TABLE invoke_log_2026_01 PARTITION OF invoke_log
    FOR VALUES FROM ('2026-01-01') TO ('2026-02-01');
CREATE TABLE invoke_log_2026_02 PARTITION OF invoke_log
    FOR VALUES FROM ('2026-02-01') TO ('2026-03-01');
CREATE TABLE invoke_log_2026_03 PARTITION OF invoke_log
    FOR VALUES FROM ('2026-03-01') TO ('2026-04-01');
CREATE TABLE invoke_log_2026_04 PARTITION OF invoke_log
    FOR VALUES FROM ('2026-04-01') TO ('2026-05-01');
CREATE TABLE invoke_log_2026_05 PARTITION OF invoke_log
    FOR VALUES FROM ('2026-05-01') TO ('2026-06-01');
CREATE TABLE invoke_log_2026_06 PARTITION OF invoke_log
    FOR VALUES FROM ('2026-06-01') TO ('2026-07-01');

-- ============================================
-- 13. 模型统计表(实时统计缓存)
-- ============================================
CREATE TABLE ai_model_stats (
    id BIGSERIAL PRIMARY KEY,
    model_id BIGINT NOT NULL REFERENCES ai_model(id) ON DELETE CASCADE,
    stats_date DATE NOT NULL,
    total_calls BIGINT NOT NULL DEFAULT 0,
    success_calls BIGINT NOT NULL DEFAULT 0,
    failed_calls BIGINT NOT NULL DEFAULT 0,
    total_response_time BIGINT NOT NULL DEFAULT 0,
    avg_response_time INTEGER,
    p95_response_time INTEGER,
    p99_response_time INTEGER,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE(model_id, stats_date)
);

COMMENT ON TABLE ai_model_stats IS '模型每日统计表';

-- ============================================
-- 14. 系统配置表
-- ============================================
CREATE TABLE sys_config (
    id BIGSERIAL PRIMARY KEY,
    config_key VARCHAR(100) NOT NULL UNIQUE,
    config_value TEXT NOT NULL,
    config_type VARCHAR(20) NOT NULL DEFAULT 'STRING',
    description VARCHAR(500),
    is_system BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE sys_config IS '系统配置表';

-- ============================================
-- 15. 审计日志表
-- ============================================
CREATE TABLE audit_log (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT,
    username VARCHAR(50),
    tenant_id BIGINT,
    operation VARCHAR(50) NOT NULL,
    module VARCHAR(50) NOT NULL,
    description TEXT,
    request_method VARCHAR(10),
    request_url VARCHAR(500),
    request_params JSONB,
    response_data JSONB,
    status VARCHAR(20) NOT NULL,
    error_msg TEXT,
    ip VARCHAR(50),
    user_agent VARCHAR(500),
    duration INTEGER,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_audit_log_user ON audit_log(user_id, created_at);
CREATE INDEX idx_audit_log_tenant ON audit_log(tenant_id, created_at);
CREATE INDEX idx_audit_log_operation ON audit_log(operation, created_at);

COMMENT ON TABLE audit_log IS '操作审计日志表';

-- ============================================
-- 16. 异步任务表
-- ============================================
CREATE TABLE async_task (
    id BIGSERIAL PRIMARY KEY,
    task_id VARCHAR(64) NOT NULL UNIQUE,
    task_type VARCHAR(50) NOT NULL,
    model_id BIGINT,
    user_id BIGINT,
    tenant_id BIGINT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    progress INTEGER NOT NULL DEFAULT 0,
    request_data JSONB,
    result_data JSONB,
    error_message TEXT,
    started_at TIMESTAMP,
    completed_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_task_status CHECK (status IN ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'CANCELLED'))
);

CREATE INDEX idx_async_task_status ON async_task(status, created_at);
CREATE INDEX idx_async_task_user ON async_task(user_id, created_at);

COMMENT ON TABLE async_task IS '异步任务表';

-- ============================================
-- 初始化数据
-- ============================================

-- 初始化默认租户
INSERT INTO sys_tenant (code, name, description) VALUES 
('default', '默认租户', '系统默认租户');

-- 初始化超级管理员 (密码: admin123, BCrypt加密)
INSERT INTO sys_user (username, password, email, real_name, status, tenant_id) VALUES 
('admin', '$2a$10$N.ZOn9G6/YLFixAOPMg/h.z7pCu6v2XyFDtC4q.jeeGM/TEZyj5D6', 'admin@hospital.com', '系统管理员', 1, 1);

-- 初始化角色
INSERT INTO sys_role (code, name, description, tenant_id) VALUES 
('SUPER_ADMIN', '超级管理员', '拥有全部权限', 1),
('ADMIN', '管理员', '系统管理权限', 1),
('MODEL_MANAGER', '模型管理员', '模型管理相关权限', 1),
('API_USER', 'API用户', '接口调用权限', 1),
('VIEWER', '只读用户', '查看权限', 1);

-- 初始化权限
INSERT INTO sys_permission (code, name, resource, action) VALUES 
('model:read', '查看模型', 'model', 'read'),
('model:write', '编辑模型', 'model', 'write'),
('model:delete', '删除模型', 'model', 'delete'),
('model:execute', '执行模型', 'model', 'execute'),
('api:read', '查看接口', 'api', 'read'),
('api:write', '编辑接口', 'api', 'write'),
('api:invoke', '调用接口', 'api', 'execute'),
('user:read', '查看用户', 'user', 'read'),
('user:write', '编辑用户', 'user', 'write'),
('user:delete', '删除用户', 'user', 'delete'),
('system:config', '系统配置', 'system', 'write'),
('system:monitor', '系统监控', 'system', 'read'),
('audit:read', '查看审计', 'audit', 'read');

-- 超级管理员角色关联
INSERT INTO sys_user_role (user_id, role_id) VALUES (1, 1);

-- 超级管理员拥有全部权限
INSERT INTO sys_role_permission (role_id, permission_id) 
SELECT 1, id FROM sys_permission;

-- 初始化示例AI模型
INSERT INTO ai_model (model_id, name, type, description, version, endpoint, status, tags, tenant_id, created_by) VALUES 
('lung-nodule-v1', '肺结节智能筛查', 'IMAGE', '基于深度学习的肺结节自动检测与分析系统，支持CT影像', '1.0.0', 'http://ai-service:8000/lung-nodule', 'ONLINE', '肺部,CT,结节检测', 1, 1),
('medical-report-v1', '医疗报告生成', 'LLM', '基于大语言模型的医疗报告智能生成系统', '1.0.0', 'http://ai-service:8000/report-gen', 'ONLINE', '报告生成,NLP,LLM', 1, 1),
('pathology-v1', '病理切片分析', 'IMAGE', '病理切片AI辅助诊断系统', '1.0.0', 'http://ai-service:8000/pathology', 'ONLINE', '病理,切片,诊断', 1, 1),
('voice-transcribe-v1', '语音病历转写', 'VOICE', '医疗语音实时转写系统', '1.0.0', 'http://ai-service:8000/voice', 'MAINTENANCE', '语音,转写,病历', 1, 1);

-- 初始化模型配置
INSERT INTO ai_model_config (model_id, config_key, config_value, config_type, description) VALUES 
(1, 'timeout', '60000', 'NUMBER', '超时时间(ms)'),
(1, 'max_concurrency', '10', 'NUMBER', '最大并发数'),
(1, 'input_format', 'DICOM', 'STRING', '输入格式'),
(2, 'timeout', '30000', 'NUMBER', '超时时间(ms)'),
(2, 'max_tokens', '4096', 'NUMBER', '最大Token数'),
(2, 'temperature', '0.7', 'NUMBER', '温度参数');

-- 初始化系统配置
INSERT INTO sys_config (config_key, config_value, config_type, description, is_system) VALUES 
('system.name', '医学影像AI集成平台', 'STRING', '系统名称', true),
('system.version', '2.0.0', 'STRING', '系统版本', true),
('api.rate_limit.default', '100', 'NUMBER', '默认API限流(QPS)', true),
('api.timeout.default', '30000', 'NUMBER', '默认超时时间(ms)', true),
('log.retention.days', '90', 'NUMBER', '日志保留天数', true);

-- ============================================
-- 创建更新时间触发器
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 应用触发器到需要的表
CREATE TRIGGER update_sys_user_updated_at BEFORE UPDATE ON sys_user FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_sys_role_updated_at BEFORE UPDATE ON sys_role FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_sys_tenant_updated_at BEFORE UPDATE ON sys_tenant FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_ai_model_updated_at BEFORE UPDATE ON ai_model FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_ai_model_config_updated_at BEFORE UPDATE ON ai_model_config FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_api_endpoint_updated_at BEFORE UPDATE ON api_endpoint FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_sys_config_updated_at BEFORE UPDATE ON sys_config FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_async_task_updated_at BEFORE UPDATE ON async_task FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 完成
-- ============================================
