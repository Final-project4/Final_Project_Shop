const { test, expect } = require('@playwright/test');

test('Apply coupon button should work', async ({ page }) => {
  // Navigate to your app (make sure it's running on a local server)
  await page.goto('http://localhost:3000/cart'); // Change URL based on your app's local URL

  // Click on the "Apply" button
  await page.click('button:text("APPLY")');

  // Check if the apply voucher action has been triggered (you can mock the function in your component)
  // Here we just test that the button is clicked, but you can add assertions for actions
  const applyButton = await page.$('button:text("APPLY")');
  expect(await applyButton.isEnabled()).toBe(true);
});

test('Proceed to checkout button should show popup', async ({ page }) => {
  // Navigate to your app (make sure it's running on a local server)
  await page.goto('http://localhost:3000/cart'); // Change URL based on your app's local URL

  // Click on the "Proceed to Checkout" button
  await page.click('button.w-full.text-white.py-4.rounded-lg.font-medium.text-lg.shadow-lg.transition-colors.duration-200.cursor-pointer');

  // Wait for the checkout modal to be visible
  const checkoutModal = page.locator('.bg-white.p-6.rounded-lg.shadow-lg.relative'); // Update this with the correct modal selector

  // Verify the modal is visible
  await expect(checkoutModal).toBeVisible();
});
