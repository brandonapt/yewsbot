import changed from './web/goons/events/changed';
import serverSchema from './db/schemas/server.schema';
import { container } from '@sapphire/framework';
import { ActionRowBuilder, NewsChannel, StringSelectMenuBuilder, TextChannel } from 'discord.js';
import bulkGetArticles from './web/goons/bulkFetchArticles';

export default async function () {
	setInterval(async () => {
		const changedResults = await changed();
		if (changedResults.changed == false || changedResults.changed == undefined) return;

		const servers = await serverSchema.find();

		await bulkGetArticles(changedResults.day as string, true);

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
				// @ts-ignore - this doesn't work for some dumb reason
				await channel.send({ content: '**NEW YEWS**\n\n' + changedResults.url, files: [fileName], components: [row] });
			}
		});
	}, 10000);
}
 