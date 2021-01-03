import time
from playwright import sync_playwright


def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.newContext()

    # Open new page
    page = context.newPage()

    # Go to http://localhost/
    page.goto("http://localhost/")

    page.click('text="Posts"')

    page.click('button#login')
    time.sleep(3)
    page.click('text="Posts"')
    time.sleep(2)

    page.screenshot(path=f'playwright/screenshots/example.png')

    # Close page
    page.close()

    # ---------------------
    context.close()
    browser.close()


with sync_playwright() as playwright:
    run(playwright)
