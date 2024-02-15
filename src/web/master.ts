import { launch } from 'puppeteer';
const { container } = require('@sapphire/framework');

let browser: any;

export async function launchBrowser() {
    browser = await launch({ headless: "new" as any });
    container.logger.info('browser launched');
}

export async function closeBrowser() {
    await browser.close();
}

export { browser };