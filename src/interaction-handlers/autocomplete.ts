import { InteractionHandler, InteractionHandlerTypes } from '@sapphire/framework';
import type { AutocompleteInteraction } from 'discord.js';

export class AutocompleteHandler extends InteractionHandler {
	public constructor(ctx: InteractionHandler.LoaderContext, options: InteractionHandler.Options) {
		super(ctx, {
			...options,
			interactionHandlerType: InteractionHandlerTypes.Autocomplete
		});
	}

	public override async run(interaction: AutocompleteInteraction, result: InteractionHandler.ParseResult<this>) {
		return interaction.respond(result);
	}

	public override async parse(interaction: AutocompleteInteraction) {
		// Only run this interaction for the command with ID '1000802763292020737'
		if (interaction.commandId !== '1207791681060085760' && interaction.commandId !== '1207817743018229780') return this.none();

		// Get the focussed (current) option
		const focusedOption = interaction.options.getFocused(true);

		if (focusedOption.name == 'date') {
			const date = focusedOption?.value as string;
			if (!date) return this.some([{ name: '[info] PLEASE ENTER A VALID DATE (month-day-year)', value: 'invalid' }]);

			let formattedDate = date;
			// replace any spaces, dots, or slashes with dashes
			formattedDate = formattedDate.replace(/[\s\.\/]/g, '-');

			// Check if the date is in the correct format (m-d-yy) or (mm-dd-yy)
			if (!/^\d{1,2}-\d{1,2}-\d{2}$/.test(formattedDate))
				return this.some([{ name: '[info] PLEASE ENTER A VALID DATE (month-day-year)', value: 'invalid' }]);

			return this.some([
				{ name: `${formattedDate}-10am`, value: `${formattedDate}-10am` },
				{ name: `${formattedDate}-3pm`, value: `${formattedDate}-3pm` },
				{ name: `${formattedDate}-8pm`, value: `${formattedDate}-8pm` }
			]);
		} else if (focusedOption.name == 'article') {
			return this.some([
				{
					name: 'Article 1',
					value: '1'
				},
				{
					name: 'Article 2',
					value: '2'
				},
				{
					name: 'Article 3',
					value: '3'
				},
				{
					name: 'Article 4',
					value: '4'
				},
				{
					name: 'Article 5',
					value: '5'
				},
				{
					name: 'Article 6',
					value: '6'
				},
				{
					name: 'Article 7',
					value: '7'
				},
				{
					name: 'Article 8',
					value: '8'
				},
				{
					name: 'Article 9',
					value: '9'
				},
				{
					name: 'Article 10',
					value: '10'
				}
			]);
		}
	}
}
