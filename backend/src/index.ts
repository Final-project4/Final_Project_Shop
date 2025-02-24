export default async ({ strapi }: { strapi: any }) => {
  console.log("🚀 Strapi is booting up...");

  strapi.db.lifecycles.subscribe({
    models: ["plugin::users-permissions.user"], // ฟัง event การสร้าง User

    async afterCreate(event: any) {
      console.log("🔥 Lifecycle Hook Triggered: afterCreate User");

      const { result } = event;
      console.log("👀 New user created:", result);

      try {
        const newCart = await strapi.db.query("api::cart.cart").create({
          data: {
            user: result.id, // เชื่อม Cart กับ User
            cart_items: [], // ค่าเริ่มต้นของ cart_items
          },
        });

        console.log("✅ Cart created successfully:", newCart);
      } catch (error) {
        console.error("❌ Error creating cart:", error);
      }
    },
  });
};
