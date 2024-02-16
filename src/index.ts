import './lib/setup';

import { LogLevel, SapphireClient } from '@sapphire/framework';
import { ActivityType, GatewayIntentBits, PresenceUpdateStatus } from 'discord.js';
import { launchBrowser } from './web/master';
import { initializeClient } from './db/redis';
import { initializeMongooseClient } from './db/mongo';
import checker from './checker';
import { main as initializeCron } from './cron/clearFiles';
import status from './status';

const client = new SapphireClient({
	logger: {
		level: LogLevel.Debug
	},
	intents: [GatewayIntentBits.Guilds],
	presence: {
		status: PresenceUpdateStatus.Idle,
		activities: [
			{
				name: "complete rewrite out now!",
				type: ActivityType.Custom,
			}
		]
	}
});

const main = async () => {
	try {
		client.logger.info('Logging in');
		await client.login();
		client.logger.info('logged in');
	} catch (error) { 
		client.logger.fatal(error);
		await client.destroy();
		process.exit(1);
	}

	launchBrowser().then(() => {
		initializeClient()
		initializeMongooseClient()
		checker()
		initializeCron()
		setInterval(initializeCron, 60 * 60 * 1000);
		setInterval(status, 60 * 1000);
	});

	process.on('SIGINT', async () => {
		client.logger.info('Shutting down');
		await client.destroy();
		process.exit(0);
	});

	process.on('unhandledRejection', (error) => {
		client.logger.fatal(error);
	});

};

void main();
