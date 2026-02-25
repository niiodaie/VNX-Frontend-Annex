# Stripe Webhook Configuration

## Webhook Endpoint Setup

Your Stripe webhook is now configured with the endpoint secret:
```
whsec_4a578ba6f6df5fa9c92f3f2e665a8ced07766d93f953f5c17a3da1c0562769a1
```

## Webhook URL Configuration

In your Stripe Dashboard (https://dashboard.stripe.com/webhooks), configure your webhook endpoint:

**Endpoint URL:** `https://nexustracker.visnec.ai/api/stripe-webhook`

**Events to Listen For:**
- `checkout.session.completed` - When a payment is successful
- `customer.subscription.deleted` - When a subscription is cancelled
- `invoice.payment_succeeded` - For recurring payments
- `invoice.payment_failed` - For failed payments

## Testing Webhooks

You can test webhooks locally using Stripe CLI:

```bash
# Install Stripe CLI
# https://stripe.com/docs/stripe-cli

# Login to your Stripe account
stripe login

# Forward events to your local server
stripe listen --forward-to localhost:5000/api/stripe-webhook

# Test with a real event
stripe trigger checkout.session.completed
```

## Production Setup

1. The webhook secret is already configured in your environment variables
2. The webhook handler processes these events:
   - **checkout.session.completed**: Upgrades user to Pro/Premium
   - **customer.subscription.deleted**: Downgrades user to Free
3. All subscription changes are automatically synced to your Supabase profiles table

## Security

- Webhook signatures are verified using the endpoint secret
- Only authenticated webhook events will process subscription updates
- All errors are logged for debugging and monitoring

The payment system is now fully operational and ready for production use.