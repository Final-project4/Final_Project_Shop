export default {
    routes: [
      {
        method: 'GET',
        path: '/orders',
        handler: 'api::order.order.find',
        config: {
          auth: false,
        },
      },
      {
        method: 'POST',
        path: '/orders',
        handler: 'api::order.order.create',
        config: {
          auth: false,
        },
      },
      {
        method: 'PUT',
        path: '/orders/:id',
        handler: 'api::order.order.update',
        config: {
          auth: false,
        },
      },
      {
        method: 'DELETE',
        path: '/orders/:id',
        handler: 'api::order.order.delete',
        config: {
          auth: false,
        },
      },
      {
        method: 'GET',
        path: '/orders/:id',  // เส้นทางใหม่สำหรับค้นหา cart item โดย ID
        handler: 'api::order.order.findOne',  // เชื่อมโยงไปยัง findOne method ในคอนโทรลเลอร์
        config: {
          auth: false,  // สามารถตั้งค่า auth ได้ตามที่ต้องการ
        },
      },
    ],
  };
  