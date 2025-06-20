#!/bin/bash

# 华容道游戏部署状态检查脚本
echo "🔍 华容道游戏部署状态检查"
echo "================================"

# 检查Docker服务
echo "🐳 检查Docker状态..."
if systemctl is-active --quiet docker; then
    echo "✅ Docker服务正在运行"
else
    echo "❌ Docker服务未运行"
    exit 1
fi

# 检查容器状态
echo ""
echo "📦 检查容器状态..."
docker-compose ps

# 检查容器健康状态
echo ""
echo "🏥 检查容器健康状态..."
for container in huarongdao_postgres huarongdao_game; do
    if docker ps --filter "name=$container" --filter "status=running" | grep -q $container; then
        echo "✅ $container 正在运行"
        # 检查健康状态
        health=$(docker inspect --format='{{.State.Health.Status}}' $container 2>/dev/null || echo "unknown")
        echo "   健康状态: $health"
    else
        echo "❌ $container 未运行"
    fi
done

# 检查端口占用
echo ""
echo "🔌 检查端口状态..."
ports=(5433 8081)
for port in "${ports[@]}"; do
    if netstat -tuln | grep -q ":$port "; then
        echo "✅ 端口 $port 已占用"
    else
        echo "❌ 端口 $port 未被占用"
    fi
done

# 测试数据库连接
echo ""
echo "💾 测试数据库连接..."
if docker exec -it huarongdao_postgres pg_isready -U admin.lanlic -d game_huaroingdao > /dev/null 2>&1; then
    echo "✅ PostgreSQL数据库连接正常"
    
    # 检查表是否存在
    table_count=$(docker exec huarongdao_postgres psql -U admin.lanlic -d game_huaroingdao -t -c "SELECT count(*) FROM information_schema.tables WHERE table_schema='public';" 2>/dev/null | tr -d ' \n' || echo "0")
    echo "   数据库表数量: $table_count"
    
    if [ "$table_count" -gt 0 ]; then
        echo "   数据库表列表:"
        docker exec huarongdao_postgres psql -U admin.lanlic -d game_huaroingdao -c "\dt" 2>/dev/null | grep "public" || echo "   无法获取表列表"
    fi
else
    echo "❌ PostgreSQL数据库连接失败"
fi

# 测试Web服务
echo ""
echo "🌐 测试Web服务..."
if curl -s http://localhost:8081/health > /dev/null; then
    echo "✅ Web服务健康检查通过"
    
    # 检查游戏页面
    if curl -s http://localhost:8081/ | grep -q "华容道"; then
        echo "✅ 游戏页面加载正常"
    else
        echo "❌ 游戏页面内容异常"
    fi
else
    echo "❌ Web服务健康检查失败"
fi

# 检查日志错误
echo ""
echo "📋 检查最近的错误日志..."
echo "最近的game容器日志:"
docker-compose logs --tail=5 game 2>/dev/null || echo "无法获取game容器日志"

echo ""
echo "最近的postgres容器日志:"
docker-compose logs --tail=5 postgres 2>/dev/null || echo "无法获取postgres容器日志"

# 显示访问信息
echo ""
echo "🎯 访问信息"
echo "================================"
echo "🎮 游戏地址: http://localhost:8081/"
echo "🌐 外部访问: http://1.1.1.12:8081/"
echo "💾 数据库端口: 5433"
echo ""
echo "🛠️ 管理命令:"
echo "   查看日志: docker-compose logs -f [game|postgres]"
echo "   重启服务: docker-compose restart"
echo "   停止服务: docker-compose down"
echo "   重新构建: docker-compose up -d --build"
