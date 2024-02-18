import getNewsPage from './getNewsPage';
import yewsSchema from '../../db/schemas/yews.schema';

export default async function bulkGetArticles(day: string, images: boolean) {

	const breakingYews = await yewsSchema.findOne({ date: day });
	if (breakingYews?.date) {
		const mappedArticles = breakingYews.articles.map((article) => {
			return {
				title: article.title,
				contents: article.contents,
				image: article.image,
				url: 'https://www.yews.news/edition/' + day,
			};
		});

		return mappedArticles;
	}

	const page = await getNewsPage(`/edition/${day}`);
	const iphone = await page.$('.w-layout-blockcontainer');
	if (!iphone) {
		await page.close();
		return {
			error: 'Could not find the page. Did you enter the correct date?'
		};
	}


	const articles = await page.$$('.whole-body');
	const articleContentsArray = await page.$$('.w-richtext');

	let articleContentsText;
	let articleContents;
	let articleTitle;
	let imageUrl;
	let article;
	let articlesArray = [];

	for (let i = 0; i < articles.length; i++) {
		article = articles[i];
		articleTitle = await (await article.getProperty('textContent')).jsonValue();
		await article.click();
		await new Promise((resolve) => setTimeout(resolve, 150));

		articleContents = articleContentsArray[i];
		articleContentsText = await (await articleContents.getProperty('textContent')).jsonValue();

		const firstFourDigits = articleContentsText.match(/\d{4}\./);
		if (firstFourDigits) {
			articleContentsText = articleContentsText.slice(firstFourDigits.index + 5);
		}

		articleContentsText = articleContentsText.replace(/\.\w/g, (match: string[]) => {
			return match[0] + ' ' + match[1];
		});

		if (images == true) {
			const image = await page.$$('.image');
			const currentImage = await image[i];
			imageUrl = await currentImage.getProperty('src');

			articlesArray.push({
				url: 'https://www.yews.news/edition/' + day,
				title: articleTitle,
				contents: articleContentsText,
				image: await imageUrl.jsonValue()
			});
		} else {
			articlesArray.push({
				url: 'https://www.yews.news/edition/' + day,
				title: articleTitle,
				contents: articleContentsText
			});
		}
	}

	const dayYews = await yewsSchema.findOne({ date: day });
	if (!dayYews?.date) {
		const fresh = new yewsSchema({
			date: day,
			articles: articlesArray.map((article) => {
				return {
					title: article.title,
					contents: article.contents,
					image: article.image
				};
			})
		});
		await fresh.save();
	}

	return articlesArray;
}
