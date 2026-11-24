import { test, expect, Page } from '@playwright/test';


async function logout(page: Page) {

  await page.getByRole('button', { name: 'Open Menu' }).click();

  await page.getByText('Logout').click();

  await expect(page.getByRole('button', { name: 'Login' })).toBeVisible();
}

test.describe('SauceDemo UI автомат тестүүд', () => {


  test.beforeEach(async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
  });


  test('1. Амжилттай нэвтрэх ба гараад төгсгөх', async ({ page }) => {

    await page.getByPlaceholder('Username').fill('standard_user');
    await page.getByPlaceholder('Password').fill('secret_sauce');
    await page.getByRole('button', { name: 'Login' }).click();


    await expect(page).toHaveURL(/inventory\.html/);
    await expect(page.getByText('Products')).toBeVisible();


    await logout(page);
  });


  test('2. Буруу нууц үгээр нэвтрэхэд алдааны мессеж харагдах', async ({ page }) => {
    // Зөв хэрэглэгчийн нэр боловч буруу нууц үг оруулж оролдоно
    await page.getByPlaceholder('Username').fill('standard_user');
    await page.getByPlaceholder('Password').fill('wrong_password_123');
    await page.getByRole('button', { name: 'Login' }).click();


    const errorHeading = page.getByText('Epic sadface: Username and password do not match any user in this service');
    await expect(errorHeading).toBeVisible();
    await expect(errorHeading).toHaveText(
      'Epic sadface: Username and password do not match any user in this service'
    );
    await expect(page).toHaveURL('https://www.saucedemo.com/');
  });

  test('3. Нэвтэрч бараа сагслаад сагсанд орсныг баталгаажуулах', async ({ page }) => {
    // 1. Системд нэвтэрнэ
    await page.getByPlaceholder('Username').fill('standard_user');
    await page.getByPlaceholder('Password').fill('secret_sauce');
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page.getByText('Products')).toBeVisible();

    await page.getByRole('button', { name: 'Add to cart' }).first().click();

    await expect(page.getByRole('button', { name: 'Remove' })).toBeVisible();
    const cartBadge = page.getByText('1', { exact: true });
    await expect(cartBadge).toBeVisible();

    await cartBadge.click();
    await expect(page).toHaveURL(/cart\.html/);
    await expect(page.getByText('Your Cart')).toBeVisible();
    await expect(page.getByText('Sauce Labs Backpack')).toBeVisible();

    await logout(page);
  });
});
