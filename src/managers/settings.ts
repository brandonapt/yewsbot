import serverSchema from '../db/schemas/server.schema';

export default class SettingsManager {
	serverId: string;
	server: any;
	constructor(serverId: string) {
		this.serverId = serverId;
		serverSchema.findOne({ id: serverId }).then((server) => {
			this.server = server;
		});
	}

	async getServer() {
		const server = await serverSchema.findOne({ id: this.serverId });
		return server;
	}

	async setChannel(channel: string) {
		const server = await serverSchema.findOne({ id: this.serverId });
		if (server) {
			await serverSchema
				.findOneAndUpdate({ id: this.serverId }, { settings: { channel: channel } })
				.catch((err) => console.log(err));
		} else {
			const newServer = new serverSchema({
				id: this.serverId,
				settings: { channel: channel },
			});
			await newServer.save();
		}
		return server;
	}

	async setImages(images: boolean) {
		const server = await serverSchema.findOne({ id: this.serverId });
		if (server) {
			await serverSchema
				.findOneAndUpdate({ id: this.serverId }, { settings: { images: images } })
				.catch((err) => console.log(err));
		} else {
			const newServer = new serverSchema({
				id: this.serverId,
				settings: { images: images },
			});
			await newServer.save();
		}
		return server;
	}

	async setMention(mention: string) {
		const server = await serverSchema.findOne({ id: this.serverId });
		if (server) {
			await serverSchema
				.findOneAndUpdate({ id: this.serverId }, { settings: { mention: mention } })
				.catch((err) => console.log(err));
		} else {
			const newServer = new serverSchema({
				id: this.serverId,
				settings: { mention: mention },
			});
			await newServer.save();
		}
		return server;
	}

	async getChannel() {
		const server = await serverSchema.findOne({ id: this.serverId });
		return server?.settings?.channel ?? null;
	}

	async getImages() {
		const server = await serverSchema.findOne({ id: this.serverId });
		return server?.settings?.images ?? null;
	}

	async getMention() {
		const server = await serverSchema.findOne({ id: this.serverId });
		return server?.settings?.mention ?? null;
	}

	async getAnalytics() {
		const server = await serverSchema.findOne({ id: this.serverId });
		return server?.analytics ?? null;
	}

	async setAnalytics(name: string, description: string, memberCount: number) {
		await serverSchema.findOneAndUpdate({ id: this.serverId }, { analytics: { name: name, description: description, memberCount: memberCount } });
	}
}
