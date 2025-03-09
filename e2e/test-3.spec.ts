import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.getByRole('link', { name: 'รายการสินค้า' }).click();
  await page.getByRole('listitem').filter({ hasText: 'shirt' }).click();
  await page.getByRole('listitem').filter({ hasText: 'shirt' }).click();
  await page.getByRole('listitem').filter({ hasText: 'jacket' }).click();
  await page.getByRole('listitem').filter({ hasText: 'jacket' }).click();
  await page.getByRole('slider').nth(1).click();
  await page.getByRole('slider').first().click();
  await page.getByRole('textbox', { name: 'ค้นหาสินค้า' }).click();
  await page.getByRole('textbox', { name: 'ค้นหาสินค้า' }).fill('');
  await page.getByRole('link', { name: 'Levi\'s Men\'s Allover Belt' }).click();
  await page.getByRole('button', { name: 'L 4 ชิ้น' }).click();
  await page.getByRole('button', { name: 'ขาว' }).click();
  await page.getByRole('button', { name: 'เพิ่มลงตะกร้า' }).click();
  await page.getByRole('button', { name: 'ปิด' }).click();
});