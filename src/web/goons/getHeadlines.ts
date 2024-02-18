import getNewsPage from './getNewsPage';

export default async function getAllHeadlines(day: string, images: boolean) {
	const page = await getNewsPage(`/edition/${day}`);
	const articles = await page.$$('.whole-body');

	if (articles.length === 0) {
		await page.close();
		return [];
	}

	const headlines = [];

	for (let i = 0; i < articles.length; i++) {
		const article = articles[i];
		const articleTitle = await article.getProperty('textContent');
		const articleContentsArray = await page.$$('.w-richtext');
		const articleContents = await articleContentsArray[i].getProperty('textContent');
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
			const currentImage = image[i];
			const imageUrl = await currentImage.getProperty('src');

			headlines.push({
				url: `https://www.yews.news/edition/${day}`,
				title: await articleTitle.jsonValue(),
				contents: articleContentsText,
				image: await imageUrl.jsonValue()
			});
		} else {
			headlines.push({
				url: `https://www.yews.news/edition/${day}`,
				title: await articleTitle.jsonValue(),
				contents: articleContentsText
			});
		}
	}

	await page.close();
	return headlines;
}
