import { container } from '@sapphire/framework';
import serverSchema from './db/schemas/server.schema';

export default function () {
    container.client.on('guildCreate', (guild) => {
        console.log(`Joined guild: ${guild.name}`);
        const server = new serverSchema({
            id: guild.id,
            analytics: {
                name: guild.name,
                created: new Date(),
                members: guild.memberCount
            }
        });
    
        server
            .save()
            .then(() => {
                container.logger.info(`Saved server: ${guild.name}`);
            })
            .catch((err) => {
                console.error(err);
            });
    });
    
    container.client.on('guildDelete', (guild) => {
        console.log(`Left guild: ${guild.name}`);
        serverSchema
            .findOneAndDelete({ id: guild.id })
            .then(() => {
                container.logger.info(`Deleted server: ${guild.name}`);
            })
            .catch((err) => {
                console.error(err);
            });
    });
}

