import getNewsPage from '../getNewsPage';
import { load } from 'cheerio';
import sharp from 'sharp';
import { container } from '@sapphire/framework';
import { client } from '../../../db/redis';
import { join } from 'path';

export default async function () {
	const latestHeadline = await client.get('latest-yews-headline');

	const page = await getNewsPage('/home');
	const content = await page.content();
	const $ = load(content);
	const headline = $('.collection-list').find('.w-dyn-item').last().find('a').attr('href');

	if (headline.toString() === latestHeadline.toString()) {
		await page.close();
		container.logger.info('no new news');
		return { changed: false };
	}

	const filename = join(__dirname, '../../../../tmp/scrn-croppedarticles-' + Date.now() + '.png');

	const daysNews = await getNewsPage(headline as string);

	const iphone: any = await daysNews.$('.w-layout-blockcontainer');
	await iphone.screenshot({ path: join(__dirname, '../../../../tmp/scrn-fp-tmp.png') });
	await sharp(join(__dirname, '../../../../tmp/scrn-fp-tmp.png'))
		.extract({ width: 288, height: 500, left: 0, top: 0 })
		.toFile(filename);

	await daysNews.close();

	container.logger.info('new news');

	await client.set('latest-yews-headline', headline);
	return {
		url: 'https://yews.news' + headline,
		imageName: filename,
		changed: true
	};
}
