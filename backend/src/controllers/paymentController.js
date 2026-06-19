const db = require('../db');
const { stripe, createCheckoutSession } = require('../services/stripe');

const createSubscription = async (req, res, next) => {
  const { plan } = req.body;
  const userId = req.user.id;

  try {
    // 1. Get provider info
    const providerResult = await db.query('SELECT id FROM providers WHERE user_id = $1', [userId]);
    if (providerResult.rows.length === 0) {
      return res.status(404).json({ message: 'Provider profile not found' });
    }
    const providerId = providerResult.rows[0].id;

    // 2. Handle 'free' plan directly
    if (plan === 'free') {
      await db.query(
        `INSERT INTO provider_subscriptions (provider_id, plan, status)
         VALUES ($1, $2, $3)
         ON CONFLICT (provider_id) DO UPDATE SET
          plan = EXCLUDED.plan,
          status = EXCLUDED.status,
          updated_at = CURRENT_TIMESTAMP`,
        [providerId, 'free', 'active']
      );
      return res.json({ success: true, message: 'Subscribed to free plan' });
    }

    // 3. Create Stripe Checkout Session for 'premium'
    const session = await createCheckoutSession(providerId, req.user.email, plan);

    res.json({
      success: true,
      url: session.url
    });
  } catch (error) {
    next(error);
  }
};

const handleWebhook = async (req, res, next) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const { providerId, plan } = session.metadata;
        const stripeCustomerId = session.customer;
        const stripeSubscriptionId = session.subscription;

        await db.query(
          `INSERT INTO provider_subscriptions (provider_id, stripe_customer_id, stripe_subscription_id, plan, status)
           VALUES ($1, $2, $3, $4, $5)
           ON CONFLICT (provider_id) DO UPDATE SET
            stripe_customer_id = EXCLUDED.stripe_customer_id,
            stripe_subscription_id = EXCLUDED.stripe_subscription_id,
            plan = EXCLUDED.plan,
            status = EXCLUDED.status`,
          [providerId, stripeCustomerId, stripeSubscriptionId, plan, 'active']
        );
        break;
      }
      case 'customer.subscription.updated': {
        const subscription = event.data.object;
        const status = subscription.status === 'active' ? 'active' : subscription.status;
        
        await db.query(
          'UPDATE provider_subscriptions SET status = $1 WHERE stripe_subscription_id = $2',
          [status, subscription.id]
        );
        break;
      }
      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        await db.query(
          "UPDATE provider_subscriptions SET status = 'canceled', plan = 'free' WHERE stripe_subscription_id = $2",
          [subscription.id]
        );
        break;
      }
    }

    res.json({ received: true });
  } catch (error) {
    next(error);
  }
};

const getSubscriptionStatus = async (req, res, next) => {
  const { providerId } = req.params;

  try {
    const result = await db.query(
      'SELECT plan, status, stripe_subscription_id, created_at FROM provider_subscriptions WHERE provider_id = $1',
      [providerId]
    );

    if (result.rows.length === 0) {
      return res.json({
        success: true,
        data: { plan: 'free', status: 'active' }
      });
    }

    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createSubscription,
  handleWebhook,
  getSubscriptionStatus
};
