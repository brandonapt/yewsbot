import './lib/setup';

import { LogLevel, SapphireClient } from '@sapphire/framework';
import { GatewayIntentBits, OAuth2Scopes, PresenceUpdateStatus } from 'discord.js';
import { launchBrowser } from './web/master';
import { initializeClient } from './db/redis';
import { initializeMongooseClient } from './db/mongo';
import checker from './checker';
import { main as initializeCron } from './cron/clearFiles';
import status from './status';
import '@sapphire/plugin-api/register';
import analytics from './analytics';

const client = new SapphireClient({
	logger: {
		level: LogLevel.Debug
	},
	intents: [GatewayIntentBits.Guilds],
	presence: {
		status: PresenceUpdateStatus.Idle,
	},
	api: {
		auth: {
			id: process.env.DISCORD_CLIENT_ID as string,
			secret: process.env.DISCORD_CLIENT_SECRET as string,
			// replace in production
			cookie: "yews-cookie",
			redirect: "http://localhost:4000/oauth/callback",
			scopes: [OAuth2Scopes.Identify, OAuth2Scopes.Guilds],
			domainOverwrite: '127.0.0.1'
		},
		listenOptions: {
			port: 4000
		}
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

	launchBrowser().then(async () => {
		await initializeClient()
		await initializeMongooseClient()
		await checker()
		await initializeCron()
		await setInterval(initializeCron, 60 * 60 * 1000);
		await setInterval(status, 60 * 1000);
		await setTimeout(status, 1000);
		await setTimeout(analytics, 1000);
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
