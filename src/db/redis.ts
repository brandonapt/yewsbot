import { createClient } from 'redis';
import { container } from '@sapphire/framework';

let client: any;

export async function initializeClient() {
	client = await createClient({
		password: process.env.REDIS_PASSWORD,
		socket: {
			host: process.env.REDIS_HOST,
			port: process.env.REDIS_PORT as unknown as number
		}
	})
		.on('error', (error) => {
			container.logger.error(error);
		})
		.connect();
}

export { client };
