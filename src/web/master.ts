import { launch } from 'puppeteer';
const { container } = require('@sapphire/framework');

let browser: any;
const prod = process.argv.includes('--prod');

export async function launchBrowser() {
    if (prod) {
        browser = await launch({ headless: "new" as any, executablePath: '/usr/lib/chromium-browser', args: ['--no-sandbox', '--disable-setuid-sandbox'] });
        container.logger.info('browser launched in production mode');
    } else {
        browser = await launch({ headless: "new" as any });
    }
    container.logger.info('browser launched');
}

export async function closeBrowser() {
    await browser.close();
}

export { browser };