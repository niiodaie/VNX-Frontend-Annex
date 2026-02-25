import { test, expect } from '@playwright/test';

test.describe('AI Project Planner – Basic Flow', () => {
  test('Submit a project and detect premium gating', async ({ page }) => {
    // Navigate to the project planning page
    await page.goto('https://nexustracker.visnec.ai/project-planning');

    // Wait for page to load
    await page.waitForLoadState('networkidle');

    // Find the input field for project description
    const input = page.getByPlaceholder(/describe your project/i);
    const generateBtn = page.getByRole('button', { name: /Generate Plan/i });

    // Fill in the project description
    await input.fill('Launch a remote coding bootcamp');
    await generateBtn.click();

    // Wait for AI response (increased timeout for API call)
    await expect(page.getByText(/AI-Generated Plan/i)).toBeVisible({ timeout: 15000 });

    // Check for milestone output
    const milestoneCards = page.locator('[data-testid="milestone-card"], .milestone, h3:has-text("Milestone")');
    await expect(milestoneCards.first()).toBeVisible();

    // Check for premium gating notice
    const premiumText = page.locator('text=/Premium feature|Upgrade|more.*available/i');
    await expect(premiumText.first()).toBeVisible();

    // Verify export functionality is gated
    const exportSection = page.locator('text=/Export.*Feature|Unlock/i');
    await expect(exportSection.first()).toBeVisible();
  });

  test('Verify login prompt for non-authenticated users', async ({ page }) => {
    // Navigate to project planning page without logging in
    await page.goto('https://nexustracker.visnec.ai/project-planning');
    await page.waitForLoadState('networkidle');

    // Should see signup/login prompts
    const authPrompt = page.locator('text=/Sign up|Get Started|Sign In/i');
    await expect(authPrompt.first()).toBeVisible();
  });

  test('Verify responsive design elements', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('https://nexustracker.visnec.ai/project-planning');
    await page.waitForLoadState('networkidle');

    // Check that main elements are visible on mobile
    const title = page.getByText(/AI Project Planning/i);
    await expect(title).toBeVisible();

    const textarea = page.getByPlaceholder(/describe your project/i);
    await expect(textarea).toBeVisible();
  });

  test('Complete workflow: Generate, Save, and Export plan', async ({ page }) => {
    await page.goto('https://nexustracker.visnec.ai/project-planning');
    await page.waitForLoadState('networkidle');

    // Generate a plan
    const input = page.getByPlaceholder(/describe your project/i);
    const generateBtn = page.getByRole('button', { name: /Generate Plan/i });

    await input.fill('Build a social media analytics dashboard with real-time data visualization and user engagement metrics');
    await generateBtn.click();

    // Wait for AI response and verify plan generation
    await expect(page.getByText(/AI-Generated Plan/i)).toBeVisible({ timeout: 20000 });
    
    // Verify action buttons are present
    const saveBtn = page.getByRole('button', { name: /Save Plan/i });
    const exportBtn = page.getByRole('button', { name: /Export Plan/i });
    
    await expect(saveBtn).toBeVisible();
    await expect(exportBtn).toBeVisible();

    // Test export modal functionality
    await exportBtn.click();
    await expect(page.getByText(/Export Project Plan/i)).toBeVisible();
    
    // Verify export options
    await expect(page.getByText(/Markdown/i)).toBeVisible();
    await expect(page.getByText(/JSON/i)).toBeVisible();
    await expect(page.getByText(/CSV/i)).toBeVisible();

    // Check for premium features or upgrade prompts
    const premiumPrompt = page.locator('text=/Premium|Upgrade|more.*available/i');
    const editingFeature = page.locator('text=/Edit|inline.*editing/i');
    
    // Either premium features should be visible OR upgrade prompts should be present
    const hasFeatures = await premiumPrompt.first().isVisible() || await editingFeature.first().isVisible();
    expect(hasFeatures).toBeTruthy();
  });
});