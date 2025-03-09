import { test, expect } from '@playwright/test';

test('priceRange updates when slider value changes', async ({ page }) => {
  // เปิดหน้า Products ของคุณ
  await page.goto('http://localhost:3000'); // เปลี่ยน URL ให้ตรงกับที่แอปของคุณรันอยู่

  // หาตัวเลือก ReactSlider โดยการใช้ className หรือ selector ที่เหมาะสม
  const slider = await page.locator('.react-slider'); // คุณอาจจะต้องใช้ className หรือ selector ที่แม่นยำกว่านี้

  // ตรวจสอบว่า slider ปัจจุบันมีค่าเริ่มต้นเป็น [0, 10000] หรือไม่
  const initialValue = await slider.evaluate(node => node.value);
  expect(initialValue).toBe('0');

  // เปลี่ยนค่าของ slider
  await slider.fill('5000');  // กำหนดค่าใหม่ให้กับ slider

  // ตรวจสอบการอัปเดตของ UI (ที่แสดงราคา)
  await expect(page.locator('text=ต่ำสุด: 5000 บาท')).toBeVisible();
  await expect(page.locator('text=สูงสุด: 10000 บาท')).toBeVisible();
});
