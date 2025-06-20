# 服务器端口使用记录

## 当前端口占用情况
更新时间：2025年6月18日

### 已占用端口
- **5432**: PostgreSQL主数据库 (postgres容器)
- **5433**: 华容道游戏PostgreSQL (huarongdao_postgres容器)
- **5050**: pgAdmin管理界面
- **8000**: live_ai_html_backend
- **8001**: live_ai_html_frontend  
- **8080**: 1plab-os-frontend ⚠️ 已占用
- **8081**: 原计划华容道游戏端口 (改为6001)
- **9000**: Portainer管理界面
- **80**: Nginx代理管理器
- **81**: Nginx代理管理器管理界面
- **443**: HTTPS (Nginx代理管理器)

### 新分配端口
- **6001**: 华容道游戏Web服务 🎮 (huarongdao_game)

### 可用端口范围
- 6002-6099: 预留给游戏相关服务
- 7000-7999: 预留给开发测试服务
- 3000-3999: 预留给前端开发服务

## 华容道游戏服务信息
- **游戏访问地址**: http://localhost:6001/
- **外部访问地址**: http://1.1.1.12:6001/
- **数据库端口**: 5433
- **数据库名**: game_huarongdao
- **数据库用户**: admin.lanlic

## 端口冲突解决方案
1. 检查端口占用：`netstat -tuln | grep :端口号`
2. 查看Docker容器占用：`docker ps --format "table {{.Names}}\t{{.Ports}}"`
3. 停止冲突服务：`docker stop 容器名`
4. 修改配置文件中的端口号

---
**注意**: 修改端口后需要重新构建Docker容器才能生效

## ✅ 部署成功记录
**部署时间**: 2025年6月18日 15:02
**状态**: 部署成功！

### 成功信息
- ✅ PostgreSQL容器正常运行 (端口5433)
- ✅ 游戏Web容器正常运行 (端口6001)
- ✅ 健康检查通过: http://localhost:6001/health
- ✅ 游戏页面正常加载: http://localhost:6001/
- ✅ 端口冲突问题已解决

### 访问信息
- **本地访问**: http://localhost:6001/
- **外部访问**: http://1.1.1.12:6001/
- **健康检查**: http://localhost:6001/health

### 下一步
1. 开发后端API服务器连接数据库
2. 实现用户注册登录功能
3. 集成游戏进度保存功能
