export default [
  'strapi::logger',
  'strapi::errors',
  {
    name: 'strapi::security',
    config: {
      contentSecurityPolicy: false, // หรือกำหนด policy ตามต้องการ
    },
  },
  {
    name: 'strapi::cors',
    config: {
      enabled: true,
      origin: ['http://localhost:3000'], // หรือใส่ domain ของ frontend
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
      credentials: true, // ✅ เปิดให้ส่ง cookies & authentication headers
    },
  },
  'strapi::poweredBy',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];
