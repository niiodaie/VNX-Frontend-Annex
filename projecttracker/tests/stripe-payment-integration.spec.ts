import { test, expect } from '@playwright/test';

test.describe('Stripe Payment Integration', () => {
  
  test('Complete upgrade flow from TryOncePlanner to Stripe checkout', async ({ page }) => {
    await page.goto('https://nexustracker.visnec.ai/project-planning');
    await page.waitForLoadState('networkidle');

    // Generate AI plan to trigger upgrade prompts
    const input = page.getByPlaceholder(/describe your project/i);
    const generateBtn = page.getByRole('button', { name: /Generate Plan/i });

    await input.fill('Build an e-commerce platform with payment processing');
    await generateBtn.click();

    // Wait for plan generation
    await expect(page.getByText(/AI-Generated Plan/i)).toBeVisible({ timeout: 20000 });
    
    // Look for upgrade button in the generated plan view
    const upgradeButton = page.getByRole('button', { name: /Upgrade Now/i });
    await expect(upgradeButton).toBeVisible();

    // Click upgrade to start Stripe checkout (will redirect to Stripe)
    await upgradeButton.click();
    
    // Should redirect away from the site to Stripe checkout
    // In a real test, you'd use Stripe's test environment
    await page.waitForTimeout(2000);
    
    // Verify we're redirected (URL should change)
    const currentUrl = page.url();
    expect(currentUrl).toContain('checkout.stripe.com');
  });

  test('Upgrade page Stripe integration', async ({ page }) => {
    await page.goto('https://nexustracker.visnec.ai/upgrade');
    await page.waitForLoadState('networkidle');

    // Look for Pro plan upgrade button
    const proUpgradeBtn = page.locator('text=/Upgrade to Pro/i').first();
    await expect(proUpgradeBtn).toBeVisible();

    // Click to initiate Stripe checkout
    await proUpgradeBtn.click();
    
    // Should redirect to Stripe checkout
    await page.waitForTimeout(2000);
    const currentUrl = page.url();
    expect(currentUrl).toContain('checkout.stripe.com');
  });

  test('Success page displays after payment completion', async ({ page }) => {
    // Simulate successful payment return
    await page.goto('https://nexustracker.visnec.ai/upgrade/success?success=true&session_id=cs_test_123');
    await page.waitForLoadState('networkidle');

    // Verify success elements
    await expect(page.getByText(/Welcome to Premium/i)).toBeVisible();
    await expect(page.getByText(/subscription has been activated/i)).toBeVisible();
    
    // Check for premium features list
    await expect(page.getByText(/Unlimited AI project planning/i)).toBeVisible();
    await expect(page.getByText(/Export to Markdown, JSON, CSV/i)).toBeVisible();
    
    // Verify action buttons
    const startPlanningBtn = page.getByRole('button', { name: /Start AI Planning/i });
    const dashboardBtn = page.getByRole('button', { name: /Go to Dashboard/i });
    
    await expect(startPlanningBtn).toBeVisible();
    await expect(dashboardBtn).toBeVisible();
  });

  test('Canceled payment flow', async ({ page }) => {
    // Simulate canceled payment return
    await page.goto('https://nexustracker.visnec.ai/upgrade/success?canceled=true');
    await page.waitForLoadState('networkidle');

    // Verify cancel elements
    await expect(page.getByText(/Payment Canceled/i)).toBeVisible();
    await expect(page.getByText(/No charges were made/i)).toBeVisible();
    
    // Check for retry and dashboard buttons
    const tryAgainBtn = page.getByRole('button', { name: /Try Again/i });
    const dashboardBtn = page.getByRole('button', { name: /Return to Dashboard/i });
    
    await expect(tryAgainBtn).toBeVisible();
    await expect(dashboardBtn).toBeVisible();
  });

  test('API endpoint validation', async ({ request }) => {
    // Test checkout session creation endpoint
    const response = await request.post('https://nexustracker.visnec.ai/api/create-checkout-session', {
      data: {
        userId: 'test-user-123',
        email: 'test@example.com',
        plan: 'premium'
      }
    });

    expect(response.status()).toBe(200);
    
    const data = await response.json();
    expect(data).toHaveProperty('url');
    expect(data.url).toContain('checkout.stripe.com');
  });

  test('Webhook endpoint security', async ({ request }) => {
    // Test webhook without proper signature (should fail)
    const response = await request.post('https://nexustracker.visnec.ai/api/stripe-webhook', {
      headers: {
        'Content-Type': 'application/json',
        'stripe-signature': 'invalid-signature'
      },
      data: {
        type: 'checkout.session.completed',
        data: { object: { metadata: { userId: 'test' } } }
      }
    });

    // Should reject with 400 due to invalid signature
    expect(response.status()).toBe(400);
    
    const errorText = await response.text();
    expect(errorText).toContain('Webhook Error');
  });

  test('Premium feature gating in AI planner', async ({ page }) => {
    await page.goto('https://nexustracker.visnec.ai/project-planning');
    await page.waitForLoadState('networkidle');

    // Generate a plan to see feature restrictions
    const input = page.getByPlaceholder(/describe your project/i);
    await input.fill('Test project for feature validation');
    
    const generateBtn = page.getByRole('button', { name: /Generate Plan/i });
    await generateBtn.click();

    await expect(page.getByText(/AI-Generated Plan/i)).toBeVisible({ timeout: 20000 });

    // Check for premium upgrade prompts or limited features
    const premiumPrompts = page.locator('text=/Premium|Upgrade|more.*available/i');
    const hasUpgradePrompts = await premiumPrompts.count() > 0;
    
    // Should have upgrade prompts for free users
    expect(hasUpgradePrompts).toBeTruthy();
  });
});

test.describe('Payment Flow User Experience', () => {
  
  test('Mobile responsiveness of upgrade components', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('https://nexustracker.visnec.ai/upgrade');
    await page.waitForLoadState('networkidle');

    // Check mobile layout
    const upgradeCards = page.locator('[data-testid="plan-card"], .plan-card, text=/Upgrade to/');
    await expect(upgradeCards.first()).toBeVisible();

    // Verify buttons are clickable on mobile
    const upgradeBtn = page.getByRole('button', { name: /Upgrade to Pro/i }).first();
    await expect(upgradeBtn).toBeVisible();
  });

  test('Loading states during checkout initiation', async ({ page }) => {
    await page.goto('https://nexustracker.visnec.ai/upgrade');
    await page.waitForLoadState('networkidle');

    const upgradeBtn = page.getByRole('button', { name: /Upgrade to Pro/i }).first();
    
    // Click and check for loading state
    await upgradeBtn.click();
    
    // Should show loading state briefly before redirect
    const loadingIndicator = page.locator('text=/Processing|Loading|Creating/i');
    const hasLoadingState = await loadingIndicator.isVisible({ timeout: 1000 }).catch(() => false);
    
    // Either shows loading or redirects quickly (both are valid)
    const isRedirected = await page.waitForURL(/checkout\.stripe\.com/, { timeout: 5000 }).then(() => true).catch(() => false);
    
    expect(hasLoadingState || isRedirected).toBeTruthy();
  });
});