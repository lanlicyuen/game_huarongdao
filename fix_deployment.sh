#!/bin/bash

# 华容道游戏部署修复脚本
echo "🚀 开始修复华容道游戏部署..."

# 检查当前目录
if [ ! -f "docker-compose.yml" ]; then
    echo "❌ 错误: 请在项目根目录执行此脚本"
    exit 1
fi

# 1. 备份原始Dockerfile
echo "📦 备份原始Dockerfile..."
if [ -f "Dockerfile" ]; then
    cp Dockerfile Dockerfile.backup
    echo "✅ 已备份到 Dockerfile.backup"
fi

# 2. 修复Dockerfile语法错误
echo "🔧 修复Dockerfile语法错误..."
cat > Dockerfile << 'EOF'
# 使用nginx作为Web服务器
FROM nginx:alpine

# 删除默认nginx配置
RUN rm /etc/nginx/conf.d/default.conf

# 复制游戏文件到nginx目录
COPY index.html /usr/share/nginx/html/
COPY style.css /usr/share/nginx/html/
COPY script.js /usr/share/nginx/html/
COPY database.js /usr/share/nginx/html/
COPY info.png /usr/share/nginx/html/

# 复制nginx配置文件
COPY nginx.conf /etc/nginx/nginx.conf

# 暴露80端口
EXPOSE 80

# 启动nginx - 修复了语法错误
CMD ["nginx", "-g", "daemon off;"]
EOF

echo "✅ Dockerfile语法错误已修复"

# 3. 停止现有容器
echo "🛑 停止现有容器..."
docker-compose down

# 4. 清理旧镜像
echo "🧹 清理旧镜像..."
docker image prune -f

# 5. 重新构建镜像
echo "🔨 重新构建镜像..."
docker-compose build --no-cache

# 6. 启动服务
echo "🚀 启动服务..."
docker-compose up -d

# 7. 等待服务启动
echo "⏳ 等待服务启动..."
sleep 10

# 8. 检查容器状态
echo "📊 检查容器状态..."
docker-compose ps

# 9. 测试健康检查
echo "🏥 测试健康检查..."
if curl -s http://localhost:8081/health > /dev/null; then
    echo "✅ 健康检查通过"
else
    echo "❌ 健康检查失败"
fi

# 10. 测试游戏页面
echo "🎮 测试游戏页面..."
if curl -s http://localhost:8081/ | grep -q "华容道"; then
    echo "✅ 游戏页面加载成功"
else
    echo "❌ 游戏页面加载失败"
fi

# 11. 显示访问信息
echo ""
echo "🎉 部署完成！"
echo "📱 本地访问: http://localhost:8081/"
echo "🌐 远程访问: http://1.1.1.12:8081/"
echo "💾 数据库端口: 5433"
echo ""
echo "📋 检查日志命令:"
echo "   docker-compose logs -f game"
echo "   docker-compose logs -f postgres"
