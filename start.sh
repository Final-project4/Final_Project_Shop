#!/bin/bash

echo "🚀 กำลังเริ่มระบบด้วย Docker Compose..."
docker-compose up -d
cd backend
npm i
npm run develop &
echo "✅ MySQL และ Strapi กำลังรันอยู่..."

echo "🚀 Frontend..."
cd ../frontend
npm i
npm start & 

echo "✅ ระบบพร้อมใช้งานแล้ว!"
