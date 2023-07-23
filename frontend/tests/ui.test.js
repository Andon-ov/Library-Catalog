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
    await page.click('a[href="/create"]');
    await page.waitForSelector('#create-page');

    await page.fill('#title', 'Test Book');
    await page.fill('#description', 'This is a test book description');
    await page.fill('#image', 'http://example.com/book-image.jpg');
    await page.selectOption('#type', 'Fiction');

    await page.click('#create-page input[type="submit"]');

    await page.waitForURL('http://localhost:3000/catalog');
    expect(page.url()).toBe('http://localhost:3000/catalog');

});



test('Submit the Form with Empty Title Field', async ({ page }) => {
    await page.goto('http://localhost:3000/login');
    await page.fill('input[name="email"]', 'peter@abv.bg');
    await page.fill('input[name="password"]', '123456');

    await Promise.all([
        page.click('input[type="submit"]'),
        page.waitForURL('http://localhost:3000/catalog')
    ]);
    await page.click('a[href="/create"]');
    await page.waitForSelector('#create-page');

    await page.fill('#description', 'This is a test book description');
    await page.fill('#image', 'http://example.com/book-image.jpg');
    await page.selectOption('#type', 'Fiction');

    page.on('dialog', async dialog => {
        expect(dialog.type()).toContain('alert');
        expect(dialog.message()).toContain("All fields are required!");
        await dialog.accept();

        await page.$('a[href="/create"]')
        expect(page.url()).toBe('http://localhost:3000/create')
    });

});


test('Submit the Form with Empty Description Field', async ({ page }) => {
    await page.goto('http://localhost:3000/login');
    await page.fill('input[name="email"]', 'peter@abv.bg');
    await page.fill('input[name="password"]', '123456');

    await Promise.all([
        page.click('input[type="submit"]'),
        page.waitForURL('http://localhost:3000/catalog')
    ]);
    await page.click('a[href="/create"]');
    await page.waitForSelector('#create-page');

    await page.fill('#title', 'Test Book');
    await page.fill('#image', 'http://example.com/book-image.jpg');
    await page.selectOption('#type', 'Fiction');

    page.on('dialog', async dialog => {
        expect(dialog.type()).toContain('alert');
        expect(dialog.message()).toContain("All fields are required!");
        await dialog.accept();

        await page.$('a[href="/create"]')
        expect(page.url()).toBe('http://localhost:3000/create')
    });

});


test('Submit the Form with Empty Image URL Field', async ({ page }) => {
    await page.goto('http://localhost:3000/login');
    await page.fill('input[name="email"]', 'peter@abv.bg');
    await page.fill('input[name="password"]', '123456');

    await Promise.all([
        page.click('input[type="submit"]'),
        page.waitForURL('http://localhost:3000/catalog')
    ]);
    await page.click('a[href="/create"]');
    await page.waitForSelector('#create-page');

    await page.fill('#title', 'Test Book');
    await page.fill('#description', 'This is a test book description');
    await page.selectOption('#type', 'Fiction');

    page.on('dialog', async dialog => {
        expect(dialog.type()).toContain('alert');
        expect(dialog.message()).toContain("All fields are required!");
        await dialog.accept();

        await page.$('a[href="/create"]')
        expect(page.url()).toBe('http://localhost:3000/create')
    });

});

test('Verify That All Books Are Displayed', async ({ page }) => {
    await page.goto('http://localhost:3000/login');
    await page.fill('input[name="email"]', 'peter@abv.bg');
    await page.fill('input[name="password"]', '123456');

    await Promise.all([
        page.click('input[type="submit"]'),
        page.waitForURL('http://localhost:3000/catalog')
    ]);

    await page.waitForSelector('#dashboard-page')
    const bookElements = await page.$$('.other-books-list li')
    expect(bookElements.length).toBeGreaterThan(0);
});

// After remove all books
// Verify That No Books Are Displayed

test('Verify That Logged-In User Sees Details Button and Button Works Correctly', async ({ page }) => {
    await page.goto('http://localhost:3000/login');
    await page.fill('input[name="email"]', 'peter@abv.bg');
    await page.fill('input[name="password"]', '123456');

    await Promise.all([
        page.click('input[type="submit"]'),
        page.waitForURL('http://localhost:3000/catalog')
    ]);

    await page.click('a[href="/catalog"]');
    await page.waitForSelector('.otherBooks a.button');

    await page.click('.otherBooks a.button');
    await page.waitForSelector('.book-information');

    const detailsPageTitle = await page.textContent('.book-information h3')
    expect(detailsPageTitle).toBe('Test Book')
});


test('Verify That Guest User Sees Details Button and Button Works Correctly', async ({ page }) => {
    await page.goto('http://localhost:3000/catalog');
    await page.waitForSelector('.otherBooks a.button');

    await page.click('.otherBooks a.button');
    await page.waitForSelector('.book-information');

    const detailsPageTitle = await page.textContent('.book-information h3')
    expect(detailsPageTitle).toBe('Test Book')
});


test(' Verify That All Info Is Displayed Correctly', async ({ page }) => {
    await page.goto('http://localhost:3000/catalog');
    await page.waitForSelector('.otherBooks a.button');

    await page.click('.otherBooks a.button');
    await page.waitForSelector('.book-information');

    const detailsPageTitle = await page.textContent('.book-information h3')
    const detailsPageDescription = await page.textContent('.book-description p')
    const detailsPageImage = await page.innerHTML('.img')
    const detailsPageType = await page.textContent('.type')

    expect(detailsPageTitle).toBe('Test Book')
    expect(detailsPageDescription).toBe('This is a test book description')
    expect(detailsPageImage).toBe('<img src="http://example.com/book-image.jpg">')
    expect(detailsPageType).toBe('Type: Fiction')

});


test('Verify If Edit and Delete Buttons Are Visible for Creator', async ({ page }) => {
    await page.goto('http://localhost:3000/login');
    // login
    await page.fill('input[name="email"]', 'peter@abv.bg');
    await page.fill('input[name="password"]', '123456');

    await Promise.all([
        page.click('input[type="submit"]'),
        // go to catalog
        page.waitForURL('http://localhost:3000/catalog')
    ]);

    // click to my books
    await page.click('a[href="/profile"]');
    await page.waitForSelector('.otherBooks a.button');

    await page.click('.otherBooks a.button');
    await page.waitForSelector('.book-information');

    const editButton = await page.textContent('.actions > a:nth-child(1)')
    const deleteButton = await page.textContent('.actions > a:nth-child(2)')

    expect(editButton).toBe('Edit')
    expect(deleteButton).toBe('Delete')

});


test('Verify That the "Logout" Button Redirects Correctly', async ({ page }) => {
    await page.goto('http://localhost:3000/login');
    // login
    await page.fill('input[name="email"]', 'peter@abv.bg');
    await page.fill('input[name="password"]', '123456');

    await page.click('input[type="submit"]');

    const logoutLink = await page.$('a[href="javascript:void(0)"]');
    await logoutLink.click();

    const redirectURL = page.url();
    expect(redirectURL).toBe('http://localhost:3000/catalog')
});