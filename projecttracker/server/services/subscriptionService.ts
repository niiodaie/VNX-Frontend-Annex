import { createClient } from '@supabase/supabase-js';

if (!process.env.VITE_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('Missing required Supabase credentials');
}

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export interface SubscriptionUpdate {
  subscription_plan: 'free' | 'pro' | 'premium';
  stripe_customer_id?: string;
  stripe_subscription_id?: string;
}

export class SubscriptionService {
  async upgradeUserToPro(userId: string, stripeCustomerId?: string, stripeSubscriptionId?: string): Promise<void> {
    const updateData: SubscriptionUpdate = {
      subscription_plan: 'pro',
    };

    if (stripeCustomerId) {
      updateData.stripe_customer_id = stripeCustomerId;
    }

    if (stripeSubscriptionId) {
      updateData.stripe_subscription_id = stripeSubscriptionId;
    }

    const { error } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('id', userId);

    if (error) {
      console.error('Failed to update user subscription:', error.message);
      throw new Error(`Failed to upgrade user ${userId} to Pro: ${error.message}`);
    } else {
      console.log(`User ${userId} upgraded to Pro successfully.`);
    }
  }

  async upgradeUserToPremium(userId: string, stripeCustomerId?: string, stripeSubscriptionId?: string): Promise<void> {
    const updateData: SubscriptionUpdate = {
      subscription_plan: 'premium',
    };

    if (stripeCustomerId) {
      updateData.stripe_customer_id = stripeCustomerId;
    }

    if (stripeSubscriptionId) {
      updateData.stripe_subscription_id = stripeSubscriptionId;
    }

    const { error } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('id', userId);

    if (error) {
      console.error('Failed to update user subscription:', error.message);
      throw new Error(`Failed to upgrade user ${userId} to Premium: ${error.message}`);
    } else {
      console.log(`User ${userId} upgraded to Premium successfully.`);
    }
  }

  async cancelSubscription(userId: string): Promise<void> {
    const { error } = await supabase
      .from('profiles')
      .update({ 
        subscription_plan: 'free',
        stripe_subscription_id: null 
      })
      .eq('id', userId);

    if (error) {
      console.error('Failed to cancel user subscription:', error.message);
      throw new Error(`Failed to cancel subscription for user ${userId}: ${error.message}`);
    } else {
      console.log(`Subscription cancelled for user ${userId}.`);
    }
  }

  async getUserSubscription(userId: string): Promise<any> {
    const { data, error } = await supabase
      .from('profiles')
      .select('subscription_plan, stripe_customer_id, stripe_subscription_id')
      .eq('id', userId)
      .single();

    if (error) {
      throw new Error(`Failed to get user subscription: ${error.message}`);
    }

    return data;
  }
}

export const subscriptionService = new SubscriptionService();