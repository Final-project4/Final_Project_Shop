export default {
    routes: [
      {
        method: 'GET',
        path: '/coupons',
        handler: 'api::coupon.coupon.find',
        config: {
          auth: false,
        },
      },
      {
        method: 'POST',
        path: '/coupons',
        handler: 'api::coupon.coupon.create',
        config: {
          auth: false,
        },
      },
      {
        method: 'PUT',
        path: '/coupons/:id',
        handler: 'api::coupon.coupon.update',
        config: {
          auth: false,
        },
      },
      {
        method: 'DELETE',
        path: '/coupons/:id',
        handler: 'api::coupon.coupon.delete',
        config: {
          auth: false,
        },
      },
      {
        method: 'GET',
        path: '/coupons/:id',
        handler: 'api::coupon.coupon.findOne',
        config: {
          auth: false,
        },
      },
    ],
  };
  