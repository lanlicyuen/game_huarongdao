# 华容道游戏服务器API规范

## 概述
此API用于支持华容道游戏的用户管理和进度保存功能，使用Node.js + Express + PostgreSQL。

## 环境要求
- Node.js 18+
- PostgreSQL 15
- Docker & Docker Compose

## API端点

### 1. 健康检查
```
GET /api/health
```
**响应:**
```json
{
  "status": "ok",
  "database": "connected",
  "timestamp": "2025-06-18T10:30:00.000Z"
}
```

### 2. 用户注册
```
POST /api/register
```
**请求体:**
```json
{
  "username": "player123",
  "password": "password123",
  "email": "player@example.com"
}
```
**响应:**
```json
{
  "success": true,
  "user": {
    "id": 1,
    "username": "player123",
    "email": "player@example.com",
    "created_at": "2025-06-18T10:30:00.000Z"
  }
}
```

### 3. 用户登录
```
POST /api/login
```
**请求体:**
```json
{
  "username": "player123",
  "password": "password123"
}
```
**响应:**
```json
{
  "success": true,
  "user": {
    "id": 1,
    "username": "player123",
    "email": "player@example.com",
    "created_at": "2025-06-18T10:30:00.000Z",
    "last_login": "2025-06-18T10:30:00.000Z"
  }
}
```

### 4. 删除用户
```
DELETE /api/user/:userId
```
**响应:**
```json
{
  "success": true,
  "message": "用户已删除"
}
```

### 5. 保存游戏进度
```
POST /api/progress
```
**请求体:**
```json
{
  "user_id": 1,
  "current_level": 5,
  "move_count": 120,
  "elapsed_time": 300,
  "completed_levels": [1, 2, 3, 4]
}
```
**响应:**
```json
{
  "success": true,
  "message": "进度已保存"
}
```

### 6. 加载游戏进度
```
GET /api/progress/:userId
```
**响应:**
```json
{
  "success": true,
  "progress": {
    "user_id": 1,
    "current_level": 5,
    "move_count": 120,
    "elapsed_time": 300,
    "completed_levels": [1, 2, 3, 4],
    "saved_at": "2025-06-18T10:30:00.000Z"
  }
}
```

## 数据库表结构

### game_users 表
```sql
CREATE TABLE game_users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    email VARCHAR(100),
    last_login TIMESTAMP
);
```

### game_progress 表
```sql
CREATE TABLE game_progress (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES game_users(id) ON DELETE CASCADE,
    current_level INTEGER NOT NULL,
    move_count INTEGER DEFAULT 0,
    elapsed_time INTEGER DEFAULT 0,
    completed_levels TEXT, -- JSON数组存储
    saved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id) -- 每个用户只有一个进度记录
);
```

## 服务器文件结构
```
server/
├── package.json
├── server.js          # 主服务器文件
├── routes/
│   ├── auth.js        # 用户认证路由
│   └── progress.js    # 进度管理路由
├── db/
│   ├── connection.js  # 数据库连接
│   └── init.sql      # 初始化脚本
├── middleware/
│   └── auth.js       # 认证中间件
└── Dockerfile        # Docker配置
```

## Docker配置

### docker-compose.yml
```yaml
version: '3.8'
services:
  postgres:
    image: postgres:15
    container_name: huarongdao_postgres
    environment:
      POSTGRES_USER: admin.lanlic
      POSTGRES_PASSWORD: 98605831aAqQ
      POSTGRES_DB: game_huaroingdao
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./server/db/init.sql:/docker-entrypoint-initdb.d/init.sql
    ports:
      - "5432:5432"
  
  api:
    build: ./server
    container_name: huarongdao_api
    environment:
      DATABASE_URL: postgresql://admin.lanlic:98605831aAqQ@postgres:5432/game_huaroingdao
      PORT: 3000
    ports:
      - "3000:3000"
    depends_on:
      - postgres
  
  game:
    build: .
    container_name: huarongdao_game
    ports:
      - "8080:80"
    depends_on:
      - api

volumes:
  postgres_data:
```

## 安全考虑
1. 密码使用bcrypt加密
2. 使用CORS中间件
3. 输入验证和SQL注入防护
4. 敏感信息使用环境变量

## 部署步骤
1. 构建Docker镜像
2. 启动PostgreSQL容器
3. 运行数据库初始化脚本
4. 启动API服务器
5. 部署前端游戏

## 测试端点
```bash
# 健康检查
curl http://localhost:3000/api/health

# 注册用户
curl -X POST http://localhost:3000/api/register \
  -H "Content-Type: application/json" \
  -d '{"username":"test","password":"123456","email":"test@example.com"}'

# 用户登录
curl -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{"username":"test","password":"123456"}'
```
