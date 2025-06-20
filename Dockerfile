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
