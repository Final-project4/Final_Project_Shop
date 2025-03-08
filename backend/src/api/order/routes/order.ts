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
        path: '/orders/:id',  
        handler: 'api::order.order.findOne',  
          auth: false,  
      },
    ],
  };
  