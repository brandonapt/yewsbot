import { browser } from "../master";
import { Page } from "puppeteer";

export default async function getNewsPage(sub: string): Promise<Page> {
    const page: Page = await browser.newPage();
    await page.goto("https://yews.news" + sub);
    return page;
}