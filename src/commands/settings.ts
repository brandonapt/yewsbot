import { Subcommand } from '@sapphire/plugin-subcommands';
import SettingsManager from '../managers/settings';

// Extend `Subcommand` instead of `Command`
export class UserCommand extends Subcommand {
	public constructor(context: Subcommand.LoaderContext, options: Subcommand.Options) {
		super(context, {
			...options,
			name: 'settings',
			subcommands: [
				{
					name: 'channel',
					chatInputRun: 'runChannelChange'
				},
				{
					name: 'mention',
					chatInputRun: 'runMentionChange'
				},
				{
					name: 'images',
					chatInputRun: 'runImagesChange'
				},
				{
					name: 'get',
					chatInputRun: 'runGetSettings'
				}
			]
		});
	}

	override registerApplicationCommands(registry: Subcommand.Registry) {
		registry.registerChatInputCommand((builder) =>
			builder
				.setName('settings')
				.setDescription('settings command!') // Needed even though base command isn't displayed to end user
				.addSubcommand((command) =>
					command
						.setName('channel')
						.setDescription('change the channel YEWS is sent to')
						.addChannelOption((option) => option.setName('channel').setDescription('channel to send YEWS to').setRequired(true))
				)
				.addSubcommand((command) =>
					command
						.setName('mention')
						.setDescription('changed the role to mention when YEWS is sent')
						.addRoleOption((option) => option.setName('role').setDescription('role to @mention').setRequired(true))
				)
				.addSubcommand((command) =>
					command
						.setName('images')
						.setDescription('should the images on the YEWS site be sent with the message')
						.addBooleanOption((option) => option.setName('enabled').setDescription('images be sent').setRequired(true))
				)
				.addSubcommand((command) =>
				command
					.setName('get')
					.setDescription('get the settings for this server')
			)
		);
	}

	public async runChannelChange(interaction: Subcommand.ChatInputCommandInteraction) {
		const channel = interaction.options.getChannel('channel', true);
		const settingsManager = new SettingsManager(interaction.guildId!);

		await settingsManager.setChannel(channel.id);
		interaction.reply({ content: `YEWS will now be sent to <#${channel.id}>`, ephemeral: true });
	}

	public async runMentionChange(interaction: Subcommand.ChatInputCommandInteraction) {
		const role = interaction.options.getRole('role', true);
		const settingsManager = new SettingsManager(interaction.guildId!);

		await settingsManager.setMention(role.id);
		interaction.reply({ content: `YEWS will now mention <@&${role.id}>`, ephemeral: true });
	}

	public async runImagesChange(interaction: Subcommand.ChatInputCommandInteraction) {
		const enabled = interaction.options.getBoolean('enabled', true);
		const settingsManager = new SettingsManager(interaction.guildId!);

		await settingsManager.setImages(enabled);
		interaction.reply({ content: `YEWS will now send images: ${enabled}`, ephemeral: true });
	}

	public async runGetSettings(interaction: Subcommand.ChatInputCommandInteraction) {
		const settingsManager = new SettingsManager(interaction.guildId!);
		const guild = await settingsManager.getServer()

		const settings = guild?.settings;

		interaction.reply({ content: `Channel: <#${settings?.channel}>\nMention: <@&${settings?.mention}>\nImages: ${settings?.images}`, ephemeral: true });
	}
}
