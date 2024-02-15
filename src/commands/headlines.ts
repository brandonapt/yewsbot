import { Subcommand } from '@sapphire/plugin-subcommands';
import getDay from '../web/goons/getDay';
import { client } from "../db/redis";

// Extend `Subcommand` instead of `Command`
export class UserCommand extends Subcommand {
	public constructor(context: Subcommand.LoaderContext, options: Subcommand.Options) {
		super(context, {
			...options,
			name: 'headlines',
			subcommands: [
				{
					name: 'today',
					chatInputRun: 'getTodayHeadlines'
				},
				{
					name: 'fetch',
					chatInputRun: 'getDayHeadlines'
				},
			]
		});
	}

	override registerApplicationCommands(registry: Subcommand.Registry) {
		registry.registerChatInputCommand((builder) =>
			builder
				.setName('headlines')
				.setDescription('get headlines and stuff!') // Needed even though base command isn't displayed to end user
				.addSubcommand((command) =>
					command
						.setName('today')
						.setDescription('get today\'s YEWS headlines')
				)
				.addSubcommand((command) =>
					command
						.setName('fetch')
						.setDescription('fetch a certain date\'s YEWS headlines')
						.addStringOption((option) =>
							option
								.setName('date')
								.setDescription('date to fetch headlines for')
								.setRequired(true)
								.setAutocomplete(true)
						)
				)
		);
	}

	public async getTodayHeadlines(interaction: Subcommand.ChatInputCommandInteraction) {
		await interaction.deferReply();
		
		const latestHeadline = await client.get('latest-yews-headline');
		const split = latestHeadline.split('/')[2]
		const headlines = await getDay(split);

		await interaction.editReply({
			content: "<" + headlines.url + ">",
			files: [headlines.imageName as string]
		})
	}

	public async getDayHeadlines(interaction: Subcommand.ChatInputCommandInteraction) {
		const date = interaction.options.getString('date', true);

		if (date.includes('invalid')) {
			await interaction.reply({ content: 'Please enter a valid date (month-day-year)', ephemeral: true });
			return;
		}

		await interaction.deferReply();

		const headlines = await getDay(date);

		if ((headlines.error?.length ?? 0) > 0) {
			await interaction.editReply({ content: 'No headlines found for that date' });
			return;
		}

		await interaction.editReply({
			content: "<" + headlines.url + ">",
			files: [headlines.imageName as string]
		})
	}
}
