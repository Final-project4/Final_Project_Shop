#!/bin/bash

echo "🚀 กำลังปิดระบบ..."

# หยุดการทำงานของ frontend
cd frontend
# หยุดโปรเซสที่ใช้งานพอร์ต 3000
pid_frontend=$(powershell -Command "(Get-NetTCPConnection -LocalPort 3000).OwningProcess" 2>/dev/null)
if [ ! -z "$pid_frontend" ]; then
  taskkill /PID $pid_frontend /F
  echo "✅ Frontend หยุดการทำงานแล้ว"
else
  echo "❌ ไม่พบ frontend โปรเซส"
fi

# หยุดการทำงานของ backend (Strapi)
cd ../backend
# หยุดโปรเซสที่ใช้งานพอร์ต 1337
pid_backend=$(powershell -Command "(Get-NetTCPConnection -LocalPort 1337).OwningProcess" 2>/dev/null)
if [ ! -z "$pid_backend" ]; then
  taskkill /PID $pid_backend /F
  echo "✅ Backend หยุดการทำงานแล้ว"
else
  echo "❌ ไม่พบ backend โปรเซส"
fi

# หยุด Docker Compose
cd ..
docker-compose down

echo "✅ ระบบปิดการทำงานเรียบร้อยแล้ว!"
