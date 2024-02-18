import { Subcommand } from '@sapphire/plugin-subcommands';
import { client } from '../db/redis';
import bulkGetArticles from '../web/goons/bulkFetchArticles';
import SettingsManager from '../managers/settings';
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } from 'discord.js';

// Extend `Subcommand` instead of `Command`
export class UserCommand extends Subcommand {
	public constructor(context: Subcommand.LoaderContext, options: Subcommand.Options) {
		super(context, {
			...options,
			name: 'articles',
			subcommands: [
				{
					name: 'today',
					chatInputRun: 'getTodayArticles'
				},
				{
					name: 'fetch',
					chatInputRun: 'getDayArticles'
				}
			]
		});
	}

	override registerApplicationCommands(registry: Subcommand.Registry) {
		registry.registerChatInputCommand((builder) =>
			builder
				.setName('articles')
				.setDescription('get articles and stuff!') // Needed even though base command isn't displayed to end user
				.addSubcommand((command) => command.setName('today').setDescription("get today's YEWS articles"))
				.addSubcommand((command) =>
					command
						.setName('fetch')
						.setDescription("fetch a certain date's YEWS articles")
						.addStringOption((option) =>
							option.setName('date').setDescription('date to fetch articles for').setRequired(true).setAutocomplete(true)
						)
				)
		);
	}

	public async getTodayArticles(interaction: Subcommand.ChatInputCommandInteraction) {
		await interaction.deferReply();
		const latestHeadline = await client.get('latest-yews-headline');
		const split = latestHeadline.split('/')[2];
		const settings = new SettingsManager(interaction.guildId as string);

		const images = await settings.getImages();

		const articleData = await bulkGetArticles(split, true);

		if (!Array.isArray(articleData) || articleData.length === 0) {
			await interaction.editReply({ content: 'No headlines found' });
			return;
		}

		const embeds = articleData.map((article) => {
			const embed = new EmbedBuilder()
				.setColor(0xbcbcb9)
				.setTitle(article.title)
				.setURL(article.url)
				.setDescription(article.contents)
				.setFooter({
					text: 'yews.news | page ' + (articleData.indexOf(article) + 1) + ' of ' + articleData.length
				});

			if (images) {
				embed.setImage(article.image);
			}

			return embed;
		});

		let currentPage = 0;
		const collectorFilter = (i: { user: { id: string } }) => i.user.id === interaction.user.id;

		const previousButton = new ButtonBuilder().setCustomId('previous').setLabel('<-').setStyle(ButtonStyle.Primary);

		const cancelButton = new ButtonBuilder().setCustomId('cancel').setLabel('Cancel').setStyle(ButtonStyle.Danger);

		const nextButton = new ButtonBuilder().setCustomId('next').setLabel('->').setStyle(ButtonStyle.Primary);

		const row = new ActionRowBuilder().addComponents(previousButton, cancelButton, nextButton);

		const message = await interaction.editReply({
			embeds: [embeds[currentPage]],
			components: [row as any]
		});

		const collector = message.createMessageComponentCollector({
			filter: collectorFilter,
			time: 60000
		});

		collector.on('collect', async (i) => {
			if (i.customId === 'previous') {
				if (currentPage === 0) {
					currentPage = embeds.length - 1;
				} else {
					currentPage--;
				}
			} else if (i.customId === 'next') {
				if (currentPage === embeds.length - 1) {
					currentPage = 0;
				} else {
					currentPage++;
				}
			} else if (i.customId === 'cancel') {
				collector.stop();
				return;
			}

			await i.update({
				embeds: [embeds[currentPage]],
				components: [row] as any
			});
		});

		collector.on('end', async () => {
			await message.edit({
				components: [],
				content: 'This interaction has ended.'
			});
		});
	}

	public async getDayArticles(interaction: Subcommand.ChatInputCommandInteraction) {
		const date = interaction.options.getString('date', true);

		if (date.includes('invalid')) {
			await interaction.reply({ content: 'Please enter a valid date (month-day-year)', ephemeral: true });
			return;
		}

		await interaction.deferReply();
		const settings = new SettingsManager(interaction.guildId as string);

		const images = await settings.getImages();

		const articleData = await bulkGetArticles(date, images as boolean);

		if (!Array.isArray(articleData) || articleData.length === 0) {
			await interaction.editReply({ content: 'No headlines found' });
			return;
		}

		const embeds = articleData.map((article) => {
			return new EmbedBuilder()
				.setColor(0xbcbcb9)
				.setTitle(article.title)
				.setURL(article.url)
				.setDescription(article.contents)
				.setImage(article.image)
				.setFooter({
					text: 'yews.news | page ' + (articleData.indexOf(article) + 1) + ' of ' + articleData.length
				});
		});

		let currentPage = 0;
		const collectorFilter = (i: { user: { id: string } }) => i.user.id === interaction.user.id;

		const previousButton = new ButtonBuilder().setCustomId('previous').setLabel('<-').setStyle(ButtonStyle.Primary);

		const cancelButton = new ButtonBuilder().setCustomId('cancel').setLabel('Cancel').setStyle(ButtonStyle.Danger);

		const nextButton = new ButtonBuilder().setCustomId('next').setLabel('->').setStyle(ButtonStyle.Primary);

		const row = new ActionRowBuilder().addComponents(previousButton, cancelButton, nextButton);

		const message = await interaction.editReply({
			embeds: [embeds[currentPage]],
			components: [row as any]
		});

		const collector = message.createMessageComponentCollector({
			filter: collectorFilter,
			time: 60000
		});

		collector.on('collect', async (i) => {
			if (i.customId === 'previous') {
				if (currentPage === 0) {
					currentPage = embeds.length - 1;
				} else {
					currentPage--;
				}
			} else if (i.customId === 'next') {
				if (currentPage === embeds.length - 1) {
					currentPage = 0;
				} else {
					currentPage++;
				}
			} else if (i.customId === 'cancel') {
				collector.stop();
				return;
			}

			await i.update({
				embeds: [embeds[currentPage]],
				components: [row] as any
			});
		});

		collector.on('end', async () => {
			await message.edit({
				components: [],
				content: 'This interaction has ended.'
			});
		});
	}
}
