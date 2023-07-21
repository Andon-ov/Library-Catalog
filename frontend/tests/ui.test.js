const { test, expect } = require('@playwright/test')

test('Verify "All Books" link is  visible', async ({ page }) => {
    await page.goto('http://localhost:3000');
    await page.waitForSelector('nav.navbar');
    const allBookLink = await page.$('a[href="/catalog"]')
    const isLinkVisible = await allBookLink.isVisible();
    expect(isLinkVisible).toBe(true);
});

test('Verify "Login" button is  visible', async ({ page }) => {
    await page.goto('http://localhost:3000');
    await page.waitForSelector('nav.navbar');
    const loginButton = await page.$('a[href="/login"]')
    const isLoginButtonVisible = await loginButton.isVisible();
    expect(isLoginButtonVisible).toBe(true);
});


test('Verify "Register" button is  visible', async ({ page }) => {
    await page.goto('http://localhost:3000');
    await page.waitForSelector('nav.navbar');
    const registerButton = await page.$('a[href="/register"]')
    const isRegisterButtonVisible = await registerButton.isVisible();
    expect(isRegisterButtonVisible).toBe(true);
});


test('Verify "All Books" link is visible after user login', async ({ page }) => {
    await page.goto('http://localhost:3000/login');
    await page.fill('input[name="email"]', 'peter@abv.bg');
    await page.fill('input[name="password"]', '123456');
    await page.click('input[type="submit"]');

    const allBookLink = await page.$('a[href="/catalog"]')
    const isAllBooksLinkVisible = await allBookLink.isVisible();
    expect(isAllBooksLinkVisible).toBe(true);
});


test('Submit the Login Form with Valid Values', async ({ page }) => {
    await page.goto('http://localhost:3000/login');
    await page.fill('input[name="email"]', 'peter@abv.bg');
    await page.fill('input[name="password"]', '123456');
    await page.click('input[type="submit"]');

    await page.$('a[href="/catalog"]')
    expect(page.url()).toBe('http://localhost:3000/catalog')
});

test('Submit the Login Form with Empty Values', async ({ page }) => {
    await page.goto('http://localhost:3000/login');
    await page.click('input[type="submit"]');

    page.on('dialog', async dialog => {
        expect(dialog.type()).toContain('alert');
        expect(dialog.message()).toContain('All fields are required!');
        await dialog.accept();

        await page.$('a[href="/login"]');
        expect(page.url()).toBe('http://localhost:3000/login');
    });
});

test('Submit the Login Form with Empty Email', async ({ page }) => {
    await page.goto('http://localhost:3000/login');
    await page.fill('input[name="password"]', '123456');
    await page.click('input[type="submit"]');

    page.on('dialog', async dialog => {
        expect(dialog.type()).toContain('alert');
        expect(dialog.message()).toContain('All fields are required!');
        await dialog.accept();

        await page.$('a[href="/login"]')
        expect(page.url()).toBe('http://localhost:3000/login')
    });
});

test('Submit the Login Form with Empty Password', async ({ page }) => {
    await page.goto('http://localhost:3000/login');
    await page.click('input[type="submit"]');
    await page.fill('input[name="email"]', 'peter@abv.bg');

    page.on('dialog', async dialog => {
        expect(dialog.type()).toContain('alert');
        expect(dialog.message()).toContain('All fields are required!');
        await dialog.accept();

        await page.$('a[href="/login"]')
        expect(page.url()).toBe('http://localhost:3000/login')
    });

});

test('Submit the Register Form with Valid Values', async ({ page }) => {
    await page.goto('http://localhost:3000/register');
    await page.fill('input[name="email"]', 'peter2@abv.bg');
    await page.fill('input[name="password"]', '123456');
    await page.fill('input[name="confirm-pass"]', '123456');

    await page.click('input[type="submit"]');

    await page.$('a[href="/catalog"]')
    expect(page.url()).toBe('http://localhost:3000/catalog')
});

test('Submit the Register Form with Empty Confirm Password', async ({ page }) => {
    await page.goto('http://localhost:3000/register');
    await page.fill('input[name="email"]', 'peter1@abv.bg');
    await page.fill('input[name="password"]', '123456');

    await page.click('input[type="submit"]');

    page.on('dialog', async dialog => {
        expect(dialog.type()).toContain('alert');
        expect(dialog.message()).toContain('All fields are required!');
        await dialog.accept();

        await page.$('a[href="/register"]')
        expect(page.url()).toBe('http://localhost:3000/register')
    });
});

test('Submit the Register Form with Different Passwords', async ({ page }) => {
    await page.goto('http://localhost:3000/register');
    await page.fill('input[name="email"]', 'peter1@abv.bg');
    await page.fill('input[name="password"]', '123456');

    await page.click('input[type="submit"]');

    page.on('dialog', async dialog => {
        expect(dialog.type()).toContain('alert');
        expect(dialog.message()).toContain("Passwords don't match!");
        await dialog.accept();

        await page.$('a[href="/register"]')
        expect(page.url()).toBe('http://localhost:3000/register')
    });
});


test('Add Book with correct data', async ({ page }) => {
    await page.goto('http://localhost:3000/login');
    await page.fill('input[name="email"]', 'peter@abv.bg');
    await page.fill('input[name="password"]', '123456');

    await Promise.all([
        page.click('input[type="submit"]'),
        page.waitForURL('http://localhost:3000/catalog')
    ]);

});