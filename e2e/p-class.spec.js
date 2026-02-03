import { test, expect } from '@playwright/test';

test.describe('p-class directive', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('applies conditional class based on expression', async ({ page }) => {
    const classTest = page.locator('#class-test');
    
    // Initial: count = 2, so 'highlight' should be active (count === 2)
    await expect(classTest).toHaveClass(/highlight/);
    await expect(classTest).not.toHaveClass(/active/);
    await expect(classTest).not.toHaveClass(/warning/);
  });

  test('updates class when value increases', async ({ page }) => {
    const classTest = page.locator('#class-test');
    const plusButton = page.locator('body > button').first();

    // Initial: count = 2 -> highlight
    await expect(classTest).toHaveClass(/highlight/);

    // Increment to 3 -> active (count > 2)
    await plusButton.click();
    await expect(classTest).toHaveClass(/active/);
    await expect(classTest).not.toHaveClass(/highlight/);
    await expect(classTest).not.toHaveClass(/warning/);
  });

  test('updates class when value decreases', async ({ page }) => {
    const classTest = page.locator('#class-test');
    const minusButton = page.locator('body > button:has-text("-")').first();

    // Initial: count = 2 -> highlight
    await expect(classTest).toHaveClass(/highlight/);

    // Decrement to 1 -> warning (count < 2)
    await minusButton.click();
    await expect(classTest).toHaveClass(/warning/);
    await expect(classTest).not.toHaveClass(/highlight/);
    await expect(classTest).not.toHaveClass(/active/);
  });

  test('toggles classes through multiple state changes', async ({ page }) => {
    const classTest = page.locator('#class-test');
    const plusButton = page.locator('body > button').first();
    const minusButton = page.locator('body > button:has-text("-")').first();

    // Initial: count = 2 -> highlight
    await expect(classTest).toHaveClass(/highlight/);

    // count = 3 -> active
    await plusButton.click();
    await expect(classTest).toHaveClass(/active/);

    // count = 4 -> still active
    await plusButton.click();
    await expect(classTest).toHaveClass(/active/);

    // count = 3 -> still active
    await minusButton.click();
    await expect(classTest).toHaveClass(/active/);

    // count = 2 -> highlight
    await minusButton.click();
    await expect(classTest).toHaveClass(/highlight/);

    // count = 1 -> warning
    await minusButton.click();
    await expect(classTest).toHaveClass(/warning/);

    // count = 0 -> still warning
    await minusButton.click();
    await expect(classTest).toHaveClass(/warning/);
  });

  test('updates class via number input', async ({ page }) => {
    const classTest = page.locator('#class-test');
    const countInput = page.locator('input[type="number"][p-model="count"]');

    // Initial: count = 2 -> highlight
    await expect(classTest).toHaveClass(/highlight/);

    // Set to 5 -> active
    await countInput.fill('5');
    await expect(classTest).toHaveClass(/active/);

    // Set to 0 -> warning
    await countInput.fill('0');
    await expect(classTest).toHaveClass(/warning/);

    // Set back to 2 -> highlight
    await countInput.fill('2');
    await expect(classTest).toHaveClass(/highlight/);
  });
});
