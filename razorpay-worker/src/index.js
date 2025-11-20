import Razorpay from "razorpay";

export default {
  async fetch(request, env) {
    if (request.method !== "POST") {
      return new Response("Only POST allowed", { status: 405 });
    }

    try {
      const { amount } = await request.json();

      if (!amount) {
        return new Response("Amount is required", { status: 400 });
      }

      // Initialize Razorpay
      const razorpay = new Razorpay({
        key_id: env.RZP_KEY_ID,
        key_secret: env.RZP_KEY_SECRET,
      });

      // Creating order
      const order = await razorpay.orders.create({
        amount: amount * 100,
        currency: "INR",
        receipt: "receipt_" + Date.now(),
      });

      return new Response(JSON.stringify(order), {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });
    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), {
        status: 500,
      });
    }
  },
};
