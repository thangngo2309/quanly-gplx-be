FROM node:20-alpine

WORKDIR /app

# Copy trước package.json và package-lock.json để cài đặt dependency
COPY package*.json ./

RUN npm install

# Copy toàn bộ source code
COPY . .

# Build app NestJS
RUN npm run build

# Chạy app
CMD ["node", "dist/src/main"]
