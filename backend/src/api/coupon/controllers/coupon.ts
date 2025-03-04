import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::coupon.coupon', ({ strapi }) => ({
  async findOne(ctx) {
    const { id } = ctx.params;

    const couponId = parseInt(id, 10);
    if (isNaN(couponId)) {
      return ctx.badRequest('Invalid ID format');
    }

    try {
      // ตรวจสอบว่าคูปองมีอยู่หรือไม่
      const coupon = await strapi.db.query('api::coupon.coupon').findOne({ where: { id: couponId }, populate: ['user'] });

      if (!coupon) {
        return ctx.notFound('Coupon not found');
      }

      return ctx.send({ message: 'Coupon found', data: coupon }, 200);
    } catch (error) {
      console.error('Error fetching coupon:', error);
      return ctx.internalServerError('Something went wrong while fetching the coupon');
    }
  },
  async update(ctx) {
    const { id } = ctx.params;
    const { discount, expiration_date } = ctx.request.body.data || ctx.request.body;

    // Validation
    if (typeof discount !== 'number' || discount <= 0) {
      return ctx.badRequest('Discount must be a positive number');
    }

    const currentDate = new Date();
    const expirationDate = new Date(expiration_date);
    if (expirationDate <= currentDate) {
      return ctx.badRequest('Expiration date must be in the future');
    }

    const couponId = parseInt(id, 10);
    if (isNaN(couponId)) {
      return ctx.badRequest('Invalid ID format');
    }

    try {
      // ตรวจสอบว่าคูปองมีอยู่หรือไม่
      const coupon = await strapi.db.query('api::coupon.coupon').findOne({ where: { id: couponId } });

      if (!coupon) {
        return ctx.notFound('Coupon not found');
      }

      // อัปเดตข้อมูลคูปอง
      const updatedCoupon = await strapi.db.query('api::coupon.coupon').update({
        where: { id: couponId },
        data: { discount, expiration_date },
      });

      console.log('Updated Coupon:', updatedCoupon);

      return ctx.send({ message: 'Coupon updated successfully', data: updatedCoupon }, 200);
    } catch (error) {
      console.error('Error updating coupon:', error);

      if (error.name === 'ValidationError') {
        return ctx.badRequest('Validation error: ' + error.message);
      }

      return ctx.internalServerError('Something went wrong while updating the coupon');
    }
  },
  async create(ctx) {
    console.log("dasd")
    const {
      documentId,
      code,
      is_active,
      discount_type,
      discount_value,
      minimum_order,
      max_discount,
      valid_from,
      valid_until,
    } = ctx.request.body.data || ctx.request.body;
    try {
      const newCoupon = await strapi.db.query('api::coupon.coupon').create({
        data: {
          documentId,
          code,
          is_active,
          discount_type,
          discount_value,
          minimum_order,
          max_discount,
          valid_from,
          valid_until,
        },
      });

      console.log('Created Coupon:', newCoupon);

      return ctx.send({ message: 'Coupon created successfully', data: newCoupon }, 201);
    } catch (error) {
      console.error('Error creating coupon:', error);

      if (error.name === 'ValidationError') {
        return ctx.badRequest('Validation error: ' + error.message);
      }

      return ctx.internalServerError('Something went wrong while creating the coupon');
    }
  },
}));