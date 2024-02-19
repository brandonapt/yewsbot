import { launch } from 'puppeteer';
const { container } = require('@sapphire/framework');

let browser: any;
const prod = process.env.NODE_ENV === 'production';

export async function launchBrowser() {
    if (!prod) {
        browser = await launch({ headless: "new" as any });
    } else {
        browser = await launch({ headless: "new" as any, executablePath: '/usr/lib/chromium-browser' });
    }
    container.logger.info('browser launched');
}

export async function closeBrowser() {
    await browser.close();
}

export { browser };