import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing required Stripe secret: STRIPE_SECRET_KEY');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export interface CheckoutSessionParams {
  userId: string;
  email: string;
  priceId?: string;
}

export class StripeService {
  async createCheckoutSession(params: CheckoutSessionParams): Promise<Stripe.Checkout.Session> {
    const { userId, email, priceId } = params;
    
    // Use STRIPE_PRICE_ID from environment or fallback
    const price = priceId || process.env.STRIPE_PRICE_ID;
    
    if (!price) {
      throw new Error('Missing Stripe Price ID');
    }

    const domain = process.env.DOMAIN || 'https://nexustracker.visnec.ai';

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: price,
          quantity: 1,
        },
      ],
      mode: 'subscription', // Change to 'payment' for one-time payments
      success_url: `${domain}/upgrade/success?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${domain}/upgrade/success?canceled=true`,
      customer_email: email,
      metadata: {
        userId: userId,
      },
    });

    return session;
  }

  async constructWebhookEvent(body: Buffer, signature: string): Promise<Stripe.Event> {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    
    if (!webhookSecret) {
      throw new Error('Missing Stripe webhook secret');
    }

    return stripe.webhooks.constructEvent(body, signature, webhookSecret);
  }

  async retrieveSession(sessionId: string): Promise<Stripe.Checkout.Session> {
    return stripe.checkout.sessions.retrieve(sessionId);
  }
}

export const stripeService = new StripeService();