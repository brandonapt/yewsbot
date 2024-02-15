import { join } from "path";
import getNewsPage from "./getNewsPage";
import sharp from "sharp";

export default async function getDay(day:string) {
    const page = await getNewsPage(`/edition/${day}`);
    if (!page) {
      return {
        error: "Could not find the page. Did you enter the correct date?",
      }
    }
    const iphone = await page.$(".w-layout-blockcontainer");
    if (!iphone) {
      await page.close();
      return {
        error: "Could not find the page. Did you enter the correct date?",
      }
    }

    const filename = join(__dirname, '../../../tmp/scrn-croppedarticles-' + Date.now() + '.png');


	await iphone.screenshot({ path: join(__dirname, '../../../tmp/scrn-fp-tmp.png') });
	await sharp(join(__dirname, '../../../tmp/scrn-fp-tmp.png'))
      .extract({ width: 288, height: 500, left: 0, top: 0 })
      .toFile(filename);
  
    await page.close();
    return {
        url: `https://yews.news/edition/${day}`,
        imageName: filename,
        changed: true,
    }
}