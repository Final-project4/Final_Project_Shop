/**
 * order-item controller
 */

import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::order-item.order-item', ({ strapi }) => ({
    // ✅ สร้าง Order Item ใหม่
    async create(ctx) {
      try {
        const {quantity, price, order, size, color, item} = ctx.request.body.data || ctx.request.body;
  
        // ตรวจสอบว่าข้อมูลที่จำเป็นครบหรือไม่
        if (!quantity || !price || !order) {
          return ctx.badRequest('Missing required fields: item, quantity, price, or order');
        }
  
        // ✅ สร้าง Order Item ใหม่
        const orderItem = await strapi.db.query('api::order-item.order-item').create({
          data: {
            quantity,
            price,
            order,
            size,
            color,
            item
          },
        });
  
        console.log('New Order Item Created:', orderItem);
        return ctx.send({ message: 'Order item created successfully', data: orderItem }, 201);
      } catch (error) {
        console.error('Error creating order item:', error);
        return ctx.internalServerError('Something went wrong while creating the order item');
      }
    },
    async find(ctx) {
      try {
        
        ctx.query = {
          ...ctx.query,
          populate: ['order', 'item', 'size', 'color','*'], // เพิ่ม field ที่ต้องการ populate
        };
  
        const { data, meta } = await super.find(ctx);
        return { data, meta };
      } catch (error) {
        console.error('Error fetching order items:', error);
        return await super.find(ctx);
      }
    },
  
    async findOne(ctx) {
      try {
        
        ctx.query = {
          ...ctx.query,
          populate: ['order', 'item', 'size', 'color','*'],
        };
  
        const { data } = await super.findOne(ctx);
        return { data };  
      } catch (error) {
        console.error('Error fetching order item:', error);
        return await super.findOne(ctx);
      }
    },
  }));
  