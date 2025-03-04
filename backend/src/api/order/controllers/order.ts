/**
 * order controller
 */

import { factories } from '@strapi/strapi';
import item from '../../item/controllers/item';

export default factories.createCoreController('api::order.order', ({ strapi }) => ({
  // ค้นหา Order ตาม ID
  async findOne(ctx) {
    const { id } = ctx.params;

    // ตรวจสอบว่า ID เป็นตัวเลขหรือไม่
    const orderId = parseInt(id, 10);
    if (isNaN(orderId)) {
      return ctx.badRequest('Invalid ID format');
    }

    try {
      // ค้นหา Order พร้อมดึงข้อมูลที่เกี่ยวข้อง (populate)
      const order = await strapi.db.query('api::order.order').findOne({
        where: { id: orderId },
        populate: {
          order_items: {
            populate: {
              item: {
                populate: true, // ✅ ดึง category และ brand ของสินค้า
              },
            },
          },
          user: {
            populate: true, // ✅ ดึงที่อยู่และรูปโปรไฟล์ของลูกค้า
          },
          slip: true, // ✅ ดึงสลิปการชำระเงิน
        },
      });
      console.log(order)

      if (!order) {
        return ctx.notFound('Order not found');
      }

      // Sanitization & Response
      // const sanitizedEntity = await this.sanitizeOutput(order, ctx);
      // return this.transformResponse(sanitizedEntity);
      return order
    } catch (error) {
      console.error('Error fetching order:', error);
      return ctx.internalServerError('Something went wrong while fetching the order');
    }
  },

  // อัปเดต Order ตาม ID
  async update(ctx) {
    const { id } = ctx.params;
    console.log('Request Body:', ctx.request.body); // ตรวจสอบค่าที่ได้รับ

    const { step, total_price, slip } = ctx.request.body.data || ctx.request.body; // รองรับทั้งสองรูปแบบ

    console.log('Parsed Data:', { step, total_price, slip }); // Debug ค่าหลังจาก parse

    const orderId = parseInt(id, 10);
    if (isNaN(orderId)) {
      return ctx.badRequest('Invalid ID format');
    }

    try {
      // ตรวจสอบว่า Order มีอยู่หรือไม่
      const order = await strapi.db.query('api::order.order').findOne({ where: { id: orderId } });

      if (!order) {
        return ctx.notFound('Order not found');
      }

      // อัปเดตข้อมูล Order
      const updatedOrder = await strapi.db.query('api::order.order').update({
        where: { id: orderId },
        data: { step, total_price, slip }, // ✅ เพิ่ม slip เข้าไป
      });

      console.log('Updated Order:', updatedOrder); // ตรวจสอบค่าหลังอัปเดต

      return ctx.send({ message: 'Order updated successfully', data: updatedOrder }, 200);
    } catch (error) {
      console.error('Error updating order:', error);
      return ctx.internalServerError('Something went wrong while updating the order');
    }
  },
  async create(ctx) {
    try {
      const { user, total_price, step} = ctx.request.body.data || ctx.request.body;

      if (!user || !total_price || !step) {
        return ctx.badRequest('Missing required fields: customer, total_price, or items');
      }

      const order = await strapi.db.query('api::order.order').create({
        data: {
          user,
          total_price,
          step: 'pending',
        },
      });
      
      console.log('New Order Created:', order);
      return ctx.send({ message: 'Order created successfully', data: order }, 201);
    } catch (error) {
      console.error('Error creating order:', error);
      return ctx.internalServerError('Something went wrong while creating the order');
    }
  },
  async find(ctx) {
    try {
      
      const { query } = ctx;
      
      const orders = await strapi.entityService.findMany('api::order.order', {
        ...query,
        populate: ['order_items','user','slip']  
      });
      console.log(orders)
      
      const sanitizedEntities = await this.sanitizeOutput(orders, ctx);
      return this.transformResponse(sanitizedEntities);
    } catch (error) {
      console.error('Error fetching orders:', error);
      return ctx.internalServerError('Something went wrong while fetching the orders');
    } 
  }
}));
