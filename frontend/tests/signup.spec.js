const { test, expect } = require('@playwright/test');

test.describe('ทดสอบการลงทะเบียน', () => {
  test.beforeEach(async ({ page }) => {
    // เพิ่ม timeout และรอให้หน้าเว็บโหลดเสร็จ
    await page.goto('http://localhost:3000/signup', { waitUntil: 'networkidle', timeout: 60000 });
  });

  test('สามารถลงทะเบียนผู้ใช้ใหม่ได้', async ({ page }) => {
    const testUser = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123'
    };

    // รอให้ฟอร์มปรากฏ
    await page.waitForSelector('form', { timeout: 10000 });

    // ใช้ ID selector แทน placeholder
    await page.fill('#username', testUser.username);
    await page.fill('#email', testUser.email);
    await page.fill('#password', testUser.password);
    await page.fill('#confirmPassword', testUser.password);
    
    // คลิกปุ่ม Sign Up
    await page.click('button[type="submit"]');
    
    // รอ SweetAlert2 แสดง
    await expect(page.locator('.swal2-title')).toHaveText('Sign up successful!', { timeout: 10000 });
    
    // กด OK บน SweetAlert2
    await page.click('.swal2-confirm');
    
    // รอการ redirect
    await expect(page).toHaveURL(/.*login/, { timeout: 10000 });
  });

  test('แสดงข้อความเตือนเมื่อรหัสผ่านไม่ตรงกัน', async ({ page }) => {
    await page.waitForSelector('form', { timeout: 10000 });

    await page.fill('#username', 'testuser');
    await page.fill('#email', 'test@example.com');
    await page.fill('#password', 'password123');
    await page.fill('#confirmPassword', 'password456');
    
    await page.click('button[type="submit"]');
    
    // รอข้อความ error จาก state
    await expect(page.locator('.text-red-500')).toHaveText('Passwords do not match', { timeout: 10000 });
  });

  test('สามารถกลับไปหน้า login ได้', async ({ page }) => {
    // ใช้ button ที่มี text "Back to Login"
    const backButton = page.locator('button:has-text("Back to Login")');
    await expect(backButton).toBeVisible({ timeout: 10000 });
    await backButton.click();
    await expect(page).toHaveURL(/.*login/, { timeout: 10000 });
  });

  test('แสดงข้อความเตือนเมื่อกรอกข้อมูลไม่ครบ', async ({ page }) => {
    await page.waitForSelector('form', { timeout: 10000 });
    
    // คลิกปุ่ม Sign Up โดยไม่กรอกข้อมูล
    await page.click('button[type="submit"]');

    // ตรวจสอบ HTML5 validation
    const usernameInput = await page.locator('#username');
    const isRequired = await usernameInput.evaluate(el => el.hasAttribute('required'));
    expect(isRequired).toBeTruthy();
  });
}); 