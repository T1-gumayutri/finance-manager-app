# --- Stage 1: Build React/Vite App ---
FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# Chạy lệnh build của Vite (sẽ tạo ra thư mục /dist)
RUN npm run build

# --- Stage 2: Serve bằng Nginx ---
FROM nginx:alpine
# Copy các file đã build từ Stage 1 sang thư mục public của Nginx
COPY --from=build /app/dist /usr/share/nginx/html
# Mở cổng 80 cho web
EXPOSE 80
# Khởi chạy Nginx
CMD ["nginx", "-g", "daemon off;"]