# 游戏数据库配置信息

## 数据库连接信息
- **数据库服务器**: PostgreSQL 15
- **容器名称**: postgres
- **主机**: localhost
- **端口**: 5432
- **超级用户**: admin.lanlic
- **密码**: 98605831aAqQ
- **游戏数据库名**: game_huarongdao

## 连接方式
```bash
# Docker容器连接
docker exec -it postgres psql -U admin.lanlic -d game_huarongdao

# 外部连接字符串
postgresql://admin.lanlic:98605831aAqQ@localhost:5432/game_huarongdao
```

## 数据库表结构

### game_users 表（游戏用户表）
用于存储游戏用户的注册信息和基本数据。

```sql
CREATE TABLE game_users (
    id SERIAL PRIMARY KEY,                              -- 用户ID（主键，自增）
    username VARCHAR(50) UNIQUE NOT NULL,               -- 用户名（唯一，必填）
    password VARCHAR(255) NOT NULL,                     -- 密码（必填，建议加密存储）
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,     -- 注册时间（自动记录）
    email VARCHAR(100),                                 -- 邮箱（可选）
    last_login TIMESTAMP                                -- 最后登录时间
);

-- 性能优化索引
CREATE INDEX idx_username ON game_users(username);     -- 用户名查询索引
CREATE INDEX idx_created_at ON game_users(created_at); -- 注册时间索引
```

## 字段说明
| 字段名 | 类型 | 说明 | 约束 |
|--------|------|------|------|
| id | SERIAL | 用户唯一标识符 | 主键，自增 |
| username | VARCHAR(50) | 游戏用户名 | 唯一，不能为空，最大50字符 |
| password | VARCHAR(255) | 用户密码 | 不能为空，建议存储加密后的密码 |
| created_at | TIMESTAMP | 注册时间 | 默认当前时间戳 |
| email | VARCHAR(100) | 用户邮箱 | 可选，最大100字符 |
| last_login | TIMESTAMP | 最后登录时间 | 可选，用于统计用户活跃度 |

## 示例SQL操作

### 插入新用户
```sql
INSERT INTO game_users (username, password, email) 
VALUES ('player001', 'encrypted_password_hash', 'player001@example.com');
```

### 用户登录验证
```sql
SELECT id, username, email, last_login 
FROM game_users 
WHERE username = 'player001' AND password = 'encrypted_password_hash';
```

### 更新最后登录时间
```sql
UPDATE game_users 
SET last_login = CURRENT_TIMESTAMP 
WHERE username = 'player001';
```

### 查询用户统计
```sql
-- 总用户数
SELECT COUNT(*) as total_users FROM game_users;

-- 今日注册用户
SELECT COUNT(*) as today_registrations 
FROM game_users 
WHERE DATE(created_at) = CURRENT_DATE;

-- 活跃用户（最近7天登录过的）
SELECT COUNT(*) as active_users 
FROM game_users 
WHERE last_login >= CURRENT_DATE - INTERVAL '7 days';
```

## 安全建议
1. **密码加密**: 使用bcrypt、SHA-256等算法加密存储密码
2. **用户名验证**: 检查用户名格式和长度
3. **SQL注入防护**: 使用参数化查询
4. **连接加密**: 生产环境建议使用SSL连接

## Docker环境信息
```yaml
# docker-compose.yml 中的PostgreSQL配置
postgres:
  image: postgres:15
  container_name: postgres
  restart: always
  environment:
    POSTGRES_USER: admin.lanlic
    POSTGRES_PASSWORD: 98605831aAqQ
    POSTGRES_DB: localdb
  volumes:
    - ./postgres-data:/var/lib/postgresql/data
  ports:
    - "127.0.0.1:5432:5432"
```

## 创建日期
2025年6月18日

---
**注意**: 请妥善保管数据库密码，不要在代码中明文存储敏感信息。
