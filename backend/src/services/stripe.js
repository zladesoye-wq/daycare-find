const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const createCheckoutSession = async (providerId, email, plan) => {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price: plan === 'premium' ? process.env.STRIPE_PREMIUM_PRICE_ID : null, // Price ID from environment
        quantity: 1,
      },
    ],
    mode: 'subscription',
    success_url: `${process.env.FRONTEND_URL}/provider/dashboard?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.FRONTEND_URL}/provider/pricing`,
    customer_email: email,
    metadata: {
      providerId: providerId.toString(),
      plan: plan
    },
  });

  return session;
};

module.exports = { stripe, createCheckoutSession };
