import changed from './web/goons/events/changed';
import serverSchema from './db/schemas/server.schema';
import { container } from '@sapphire/framework';
import { join } from 'path';

export default async function () {
    setInterval(async () => {
        const changedResults = await changed();
        if (changedResults.changed == false || changedResults.changed == undefined) return;

        const servers = await serverSchema.find();
        servers.forEach(async (serverObj) => {
            const server = await container.client.guilds.fetch(serverObj.id);
            if (!server) return;

            const channel = server.channels.cache.get(serverObj.settings?.channel as string)
            if (!channel) return;

            const mention = serverObj.settings?.mention as string;

            const fileName = changedResults.imageName;
            const path = join(__dirname, '../tmp/' + fileName);
            if (mention) {
                await channel.send({ content: "**NEW YEWS** <@&" + mention + ">", files: [path] });
            } else {
                await channel.send({ content: "**NEW YEWS**", files: [path] });
            }
        });
    }, 10000)
}