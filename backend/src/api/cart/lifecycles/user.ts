export default {
    async afterCreate(event: any) {
      const { result } = event;
      console.log("👀 New User Created:", result);
  
      try {
        const newCart = await strapi.entityService.create("api::cart.cart", {
            data: {
              user: result.id,  // เชื่อม Cart กับ User
              cart_items: null,    // ค่าเริ่มต้นของ cart_items
            },
          });
        console.log("✅ Cart created:", newCart);
      } catch (error) {
        console.error("❌ Error creating cart:", error);
      }
    },
  };