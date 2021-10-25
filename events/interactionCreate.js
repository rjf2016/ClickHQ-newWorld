const { ButtonInteraction } = require('discord.js');
const client = require('../index');
const customCommandModel = require('../models/customCommand');


client.on('interactionCreate', async (interaction) => {
	// Slash Command Handling
	if (interaction.isCommand()) {

		await interaction.deferReply({ ephemeral: false }).catch(() => {});

		const cmd = client.slashCommands.get(interaction.commandName);
		if (cmd) {

			const args = [];

			for (const option of interaction.options.data) {
				if (option.type === 'SUB_COMMAND') {
					if (option.name) args.push(option.name);
					option.options?.forEach((x) => {
						if (x.value) args.push(x.value);
					});
				} else if (option.value) {
					args.push(option.value);
				}
			}
			interaction.member = interaction.guild.members.cache.get(interaction.user.id);

			cmd.run(client, interaction, args);
		} else {
			const customCommand = await customCommandModel.findOne({
				commandName: interaction.commandName,
			});
			if (!customCommand) return interaction.followUp({ content: '🤔 Idk that command' });

			return interaction.followUp({ content: customCommand.response });
		}
	}

	// Context Menu Handling
	if (interaction.isContextMenu()) {
		await interaction.deferReply({ ephemeral: false });
		const command = client.slashCommands.get(interaction.commandName);
		if (command) command.run(client, interaction);
	}

	if (interaction.isButton()) {
		if (interaction.customId.includes('joinGroup')) {
			const hax = interaction.customId.split('/');
			const [ owner, room ] = [ hax[1], hax[2] ];
			await interaction.deferReply({ ephemeral: true });
			// Let hacks begin..
			const channel = await interaction.guild.channels.cache.find(c => c.id == room);
			if (!channel) await interaction.editReply({ content: 'Oops that group no longer exists!' });
			await channel.permissionOverwrites.edit(interaction.user, {
				VIEW_CHANNEL: true,
			});
			await interaction.editReply({ content: 'You can now access the group!' });
		} else if (interaction.customId.includes('cancelGroup')) {
			if (interaction.user.id !== owner) return interaction.editReply({ content: 'Only the person who started the group can end it!' });
			await interaction.editReply({ content: 'Deleting the invitation...' });
		}
	}

});
