export default {
  routes: [
    {
      method: 'GET',
      path: '/order-items',
      handler: 'api::order-item.order-item.find',  // ดึงรายการ Order Items ทั้งหมด
      config: {
        auth: false,  // ไม่ต้องใช้ JWT (เปลี่ยนเป็น true ถ้าต้องการให้ล็อกอินก่อนใช้)
      },
    },
    {
      method: 'GET',
      path: '/order-items/:id',
      handler: 'api::order-item.order-item.findOne', // ดึง Order Item ตาม ID
      config: {
        auth: false,
      },
    },
    {
      method: 'POST',
      path: '/order-items',
      handler: 'api::order-item.order-item.create', // สร้าง Order Item ใหม่
      config: {
        auth: false,
      },
    },
    {
      method: 'PUT',
      path: '/order-items/:id',
      handler: 'api::order-item.order-item.update', // อัปเดต Order Item
      config: {
        auth: false,
      },
    },
    {
      method: 'DELETE',
      path: '/order-items/:id',
      handler: 'api::order-item.order-item.delete', // ลบ Order Item
      config: {
        auth: false,
      },
    },
  ],
};
