#!/bin/bash

echo "🚀 กำลังปิดระบบ..."

# หยุดการทำงานของ frontend
cd frontend
# หยุดโปรเซสที่ใช้งานพอร์ต 3000 (หรือพอร์ตที่เหมาะสมกับโปรเจกต์ของคุณ)
pid_frontend=$(netstat -ano | findstr :3000 | awk '{print $5}')
if [ ! -z "$pid_frontend" ]; then
  taskkill //PID $pid_frontend
  echo "✅ Frontend หยุดการทำงานแล้ว"
else
  echo "❌ ไม่พบ frontend โปรเซส"
fi

# หยุดการทำงานของ backend (Strapi)
cd ../backend
# หยุดโปรเซสที่ใช้งานพอร์ต 1337 (หรือพอร์ตที่เหมาะสมกับโปรเจกต์ของคุณ)
pid_backend=$(netstat -ano | findstr :1337 | awk '{print $5}')
if [ ! -z "$pid_backend" ]; then
  taskkill //PID $pid_backend
  echo "✅ Backend หยุดการทำงานแล้ว"
else
  echo "❌ ไม่พบ backend โปรเซส"
fi

# หยุด Docker Compose
cd ..
docker-compose down

echo "✅ ระบบปิดการทำงานเรียบร้อยแล้ว!"
