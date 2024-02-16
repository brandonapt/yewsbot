import { container } from "@sapphire/framework";
import { client } from "./db/redis";
import { ActivityType } from "discord.js";

export default async function () {
    const status = await client.get('status');
    if (!status || status == container.client.user?.presence.status) return;

    container.client.user?.setActivity({ name: status, type: ActivityType.Custom });
    container.logger.info(`Status set to ${status}`);
}