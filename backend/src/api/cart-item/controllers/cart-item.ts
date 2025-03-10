/**
 * cart-item controller
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::cart-item.cart-item', ({ strapi }) => ({
  // Customize the findOne method
  async delete(ctx) {
    const { id } = ctx.params;
    
    const cartItemId = parseInt(id, 10);
    if (isNaN(cartItemId)) {
      return ctx.badRequest('Invalid ID format');
    }
  
    try {
      
      const cartItem = await strapi.db.query('api::cart-item.cart-item').findOne({
        where: { id: cartItemId }
      });
  
      if (!cartItem) {
        return ctx.notFound('Cart item not found');
      }
  
      
      await strapi.db.query('api::cart-item.cart-item').delete({
        where: { id: cartItemId },
      });
  
      
      return ctx.send({ message: 'Item deleted successfully' }, 204);
    } catch (error) {
      console.error('Error during deletion:', error);
      return ctx.internalServerError('Something went wrong during deletion');
    }
  },
  async findOne(ctx) {
    const { id } = ctx.params;

    // Ensure the ID is numeric
    const cartItemId = parseInt(id, 10);
    if (isNaN(cartItemId)) {
      return ctx.badRequest('Invalid ID format');
    }

    // Fetch the author by ID using Strapi's db query API
    const cartItem = await strapi.db.query('api::cart-item.cart-item').findOne({
      where: { id: cartItemId },
      populate: ['item','cart','*'], // Populate related data if needed
    });

    if (!cartItem) {
      return ctx.notFound('cartItem not found');
    }

    //return author;
        
    // You can add more custom logic here if needed
    // sanitizeOutput - exclude private fields from the response
    // This will prevent sensitive fields, like password, from being exposed in the response 
    // const sanitizedEntity = await this.sanitizeOutput(cartItem, ctx);
    // return this.transformResponse(sanitizedEntity);
    return cartItem
  },
  async find(ctx) {

    // Fetch the author by ID using Strapi's db query API
    const cartItem = await strapi.db.query('api::cart-item.cart-item').findMany({
      populate: true, // Populate related data if needed
    });

    if (!cartItem) {
      return ctx.notFound('cartItem not found');  
    }

    //return author;
        
    // You can add more custom logic here if needed
    // sanitizeOutput - exclude private fields from the response
    // This will prevent sensitive fields, like password, from being exposed in the response 
    // const sanitizedEntity = await this.sanitizeOutput(cartItem, ctx);
    // return this.transformResponse(sanitizedEntity);
    return cartItem
  },
  
  async update(ctx) {
    const { id } = ctx.params;
    const { amount } = ctx.request.body; // รับจำนวนที่ส่งมาจาก request body

    const cartItemId = parseInt(id, 10);
    if (isNaN(cartItemId)) {
      return ctx.badRequest('Invalid ID format');
    }

    try {
      
      const cartItem = await strapi.db.query('api::cart-item.cart-item').findOne({
        where: { id: cartItemId }
      });

      if (!cartItem) {
        return ctx.notFound('Cart item not found');
      }

      
      await strapi.db.query('api::cart-item.cart-item').update({
        where: { id: cartItemId },
        data: { amount }, 
      });

      
      return ctx.send({ message: 'Item updated successfully' }, 200);
    } catch (error) {
      console.error('Error during update:', error);
      return ctx.internalServerError('Something went wrong during update');
    }
  },

  async create(ctx) {
    const {data} = ctx.request.body; 
    const {item,cart,amount,color,size}=data;
    console.log(item,cart,amount,color,size);
    try {
      
      const newCartItem = await strapi.db.query('api::cart-item.cart-item').create({
        data: {
          item,
          cart,
          amount,
          size,
          color
        }, 
      });

      
      return ctx.send({ message: 'Item created successfully', data: newCartItem }, 201);
    } catch (error) {
      console.error('Error during creation:', error);
      return ctx.internalServerError('Something went wrong during creation');
    }
  },
}));
