import changed from './web/goons/events/changed';
import serverSchema from './db/schemas/server.schema';
import { container } from '@sapphire/framework';
import { NewsChannel, TextChannel } from 'discord.js';

export default async function () {
	setInterval(async () => {
		const changedResults = await changed();
		if (changedResults.changed == false || changedResults.changed == undefined) return;

		const servers = await serverSchema.find();
		servers.forEach(async (serverObj) => {
			const server = await container.client.guilds.fetch(serverObj.id);
			if (!server) return;

			const channel = server.channels.cache.get(serverObj.settings?.channel as string) as TextChannel | NewsChannel;
			if (!channel) return;

			const mention = serverObj.settings?.mention as string;

			const fileName = changedResults.imageName;
			if (mention) {
				// @ts-ignore
				await channel.send({ content: '**NEW YEWS** <@&' + mention + '> \n\n' + changedResults.url, files: [fileName] });
			} else {
				// @ts-ignore
				await channel.send({ content: '**NEW YEWS**\n\n' + changedResults.url, files: [fileName] });
			}
		});
	}, 10000);
}
