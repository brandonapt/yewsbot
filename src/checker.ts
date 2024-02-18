import changed from './web/goons/events/changed';
import serverSchema from './db/schemas/server.schema';
import { container } from '@sapphire/framework';
import { ActionRowBuilder, NewsChannel, StringSelectMenuBuilder, TextChannel } from 'discord.js';
import bulkGetArticles from './web/goons/bulkFetchArticles';
import yewsSchema from './db/schemas/yews.schema';

export default async function () {
	setInterval(async () => {
		const changedResults = await changed();
		if (changedResults.changed == false || changedResults.changed == undefined) return;

		const servers = await serverSchema.find();

		const articles = await bulkGetArticles(changedResults.day as string, true);
		if (!Array.isArray(articles)) return;
		const mapped = articles.map((article, index) => {
			return {
				label: article.title,
				value: index.toString()
			};
		});

		const todaysYews = new yewsSchema({
			date: changedResults.day,
			articles: articles.map((article) => {
				return {
					title: article.title,
					contents: article.contents,
					image: article.image
				};
			})
		});

		await todaysYews.save();

		servers.forEach(async (serverObj) => {
			const server = await container.client.guilds.fetch(serverObj.id);
			if (!server) return;

			const channel = server.channels.cache.get(serverObj.settings?.channel as string) as TextChannel | NewsChannel;
			if (!channel) return;

			const mention = serverObj.settings?.mention as string;

			const fileName = changedResults.imageName;

			const row = new ActionRowBuilder().addComponents(
				new StringSelectMenuBuilder().setCustomId(`yews-${changedResults.day}`).setPlaceholder('View an article').setOptions(mapped)
			);
			if (mention) {
				// @ts-ignore
				await channel.send({ content: '**NEW YEWS** <@&' + mention + '> \n\n' + changedResults.url, files: [fileName], components: [row] });
			} else {
				// @ts-ignore
				await channel.send({ content: '**NEW YEWS**\n\n' + changedResults.url, files: [fileName], components: [row] });
			}
		});
	}, 10000);
}
