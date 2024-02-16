import { InteractionHandler, InteractionHandlerTypes } from '@sapphire/framework';
import { EmbedBuilder, type StringSelectMenuInteraction } from 'discord.js';
import findArticle from '../web/goons/findArticle';

export class MenuHandler extends InteractionHandler {
	public constructor(ctx: InteractionHandler.LoaderContext, options: InteractionHandler.Options) {
		super(ctx, {
			...options,
			interactionHandlerType: InteractionHandlerTypes.SelectMenu
		});
	}

	public override parse(interaction: StringSelectMenuInteraction) {
		if (!interaction.customId.includes('yews')) return this.none();

		return this.some();
	}

	public async run(interaction: StringSelectMenuInteraction) {
		const selected = interaction.values[0];
		const customId = interaction.customId;
        const date = customId.slice(5)
		const article = await findArticle(date, selected, false);
        const guildId = interaction.guildId as string;

		if (!article) {
			await interaction.reply({ content: 'Article not found', ephemeral: true });
			return;
		}

		const embed = new EmbedBuilder().setTitle(article.title).setURL(article.url).setDescription(article.contents).setColor(0xbcbcb9);

		await interaction.reply({
			// Remember how we can have multiple values? Let's get the first one!
			embeds: [embed],
			ephemeral: true
		});
	}
}
