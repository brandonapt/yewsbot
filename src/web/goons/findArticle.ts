import getNewsPage from './getNewsPage';

export default async function findArticle(day: string, articleIndex: number | string, images: boolean) {
	const page = await getNewsPage(`/edition/${day}`);
	const articles = await page.$$('.whole-body');

	if (articles.length === 0) {
		await page.close();
		return false;
	}

	const article = articles[+articleIndex];
	const articleTitle = await article.getProperty('textContent');
	const articleContentsArray = await page.$$('.w-richtext');
	const articleContents = await articleContentsArray[+articleIndex].getProperty('textContent');
	let articleContentsText = await articleContents.jsonValue();

	const firstFourDigits = articleContentsText.match(/\d{4}\./);
	if (firstFourDigits) {
		articleContentsText = articleContentsText.slice(firstFourDigits.index + 5);
	}

	articleContentsText = articleContentsText.replace(/\.\w/g, (match: string[]) => {
		return match[0] + ' ' + match[1];
	});

	if (images) {
		const image = await page.$$('.image');
		const currentImage = image[+articleIndex];
		const imageUrl = await currentImage.getProperty('src');

		return {
			url: `https://www.yews.news/edition/${day}`,
			title: await articleTitle.jsonValue(),
			contents: articleContentsText,
			imageUrl: await imageUrl.jsonValue()
		};
	}

	return {
		url: `https://www.yews.news/edition/${day}`,
		title: await articleTitle.jsonValue(),
		contents: articleContentsText
	};
}
