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

      const key = env.RZP_KEY_ID;
      const secret = env.RZP_KEY_SECRET;

      const body = {
        amount: amount * 100,
        currency: "INR",
        receipt: "receipt_" + Date.now(),
      };

      const response = await fetch("https://api.razorpay.com/v1/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization":
            "Basic " + btoa(`${key}:${secret}`),
        },
        body: JSON.stringify(body),
      });

      const order = await response.json();

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
