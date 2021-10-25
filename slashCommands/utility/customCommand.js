const { Client, CommandInteraction, MessageEmbed } = require("discord.js");
const customCommandModel = require('../../models/customCommand')
const { color } = require('../../config.json')

module.exports = {
	name: 'custom',
	description: 'custom command configuration',
	permissions: ['ADMINISTRATOR'],
	options: [
		{
			name: 'create',
			description: 'Create a custom command',
			type: 'SUB_COMMAND',
			options: [
				{
					name: 'command',
					description: 'Name of the new custom command. (One word, only lowercase letters)',
					type: 'STRING',
					required: true,
				},
				{
					name: 'description',
					description: 'The description for your command. Like this one you are reading.',
					type: 'STRING',
					required: true,
				},
				{
					name: 'response',
					description: 'Response that will be returned by this command. ',
					type: 'STRING',
					required: true,
				},
			],
		},
		{
			name: 'delete',
			description: 'Remove a custom command',
			type: 'SUB_COMMAND',
			options: [
				{
					name: 'command',
					description: 'Name of the custom command to delete',
					type: 'STRING',
					required: true,
				},
			],
		},
	],

	/**
	 *
	 * @param {Client} client
	 * @param {CommandInteraction} interaction
	 */

	run: async(client, interaction) => {
		const subCommand = interaction.options.getSubcommand();
		const commandName = interaction.options.getString('command');


		const customCommand = await customCommandModel.findOne({ commandName });

		const strHelpers = {
			onlyLowerCase: /^[a-z]+$/g ,
			alphanumericPunctuation: /^[a-zA-Z .,]+$/ig ,
		}


		if (subCommand === 'create') {
			const commandDescription = interaction.options.getString('description');
			const response = interaction.options.getString('response');

			const createdBy = interaction.user.id;

			if (commandName.length > 20 || strHelpers.onlyLowerCase.test(commandName) === false) {
				return interaction.followUp(`❌ Failed to create that command. \n Reason: Invalid command name. \n The command name can only be 15 characters max. No spaces, no numbers, punctuation, no funny bizz`)
			}

			if (commandDescription.length > 90 || strHelpers.alphanumericPunctuation.test(commandDescription) === false) {
				return interaction.followUp(`❌ Failed to create that command. \n Reason: Invalid command description. \n The description can only be 90 characters max. Can include [letters, whitespace, (. ,)]`)
			}

			if (client.slashCommands.has(commandName)) {
				return interaction.followUp(`❌ Failed to create that command. \n Reason: A command with that name already exists.`)
			}

			const props = {
				createdBy,
				commandName,
				commandDescription,
				response,
				guildId: interaction.guildId,
			};

			if(!customCommand) {
				await customCommandModel.create(props);
			} else {
				await customCommand.updateOne(props)
			}

			await interaction.guild.commands.create({
				name: commandName,
				description: commandDescription,
			});

			const embed = new MessageEmbed()
				.setColor(color.success)
				.setTitle('Command created ✅')
				.addField('Name', commandName)
				.addField('Description', commandDescription)
				.addField('Response', `${response} \n\n Try it out, type:  \`/${commandName}\``);

			return interaction.followUp({ embeds: [embed] })
		} else if (subCommand === 'delete') {
			if (!customCommand) return interaction.followUp({ content: '❌ That custom command doesn\'t exist' })
			await customCommand.delete();
			const command = await interaction.guild.commands.cache.find(cmd => cmd.name === commandName);
			command.delete();
			return interaction.followUp({ content: `You have deleted the custom command:  \`/${commandName}\`  🧹` })
		}
	},
};