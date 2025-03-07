export default {
    routes: [
      {
        method: 'GET',
        path: '/cart-items',
        handler: 'api::cart-item.cart-item.find',
        config: {
          auth: false,
        },
      },
      {
        method: 'POST',
        path: '/cart-items',
        handler: 'api::cart-item.cart-item.create',
        config: {
          auth: false,
        },
      },
      {
        method: 'PUT',
        path: '/cart-items/:id',
        handler: 'api::cart-item.cart-item.update',
        config: {
          auth: false,
        },
      },
      {
        method: 'DELETE',
        path: '/cart-items/:id',
        handler: 'api::cart-item.cart-item.delete',
        config: {
          auth: false,
        },
      },
      {
        method: 'GET',
        path: '/cart-items/:id',  
        handler: 'api::cart-item.cart-item.findOne',  
        config: {
          auth: false, 
        },
      },
    ],
  };
  