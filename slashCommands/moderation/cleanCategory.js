const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const { color } = require('../../config.json');

// protectedChannels are channels/categories that can't be deleted by this command.
// TODO: protectedChannels should be user defined, and saved to DB
const protectedChannels = ['General', 'Voice Channels', 'Text Channels', 'general', 'safe'];

module.exports = {
	name: 'clean',
	description: 'Delete channels from a category',
	userPermissions: ['ADMINISTRATOR'],
	type: 1, // Chat based command
	options: [
		{
			name: 'channel',
			description: 'The channel OR category. If given a category, I will delete all channels within that category.',
			type: 'CHANNEL',
			required: true,
		},
	],

	/**
	 * @param {Client} client
	 * @param {CommandInteraction} interaction
	*/

	run: async (client, interaction) => {
		// Contains the channel || category that the user input to get deleted. (Or if it's a category, to be emptied)
		const channel = interaction.options.getChannel('channel');

		// If user tried to delete a channel thats name == a name from our 'protectedChannels' array defined above; return err message
		if (protectedChannels.includes(channel.name)) {
			return interaction.followUp(`❌ No can do champ. **${channel.name}** is a protected channel or category.`)
		}
			// If (the user gave us a CATEGORY) then deletable = all channels in that category (..that are NOT listed in protected channels)
		// Else (the user gave us a CHANNEL) then deletable = that channel
		const deletable = channel.type === 'GUILD_CATEGORY' ? channel.children.filter(c => !protectedChannels.includes(c.name)) : channel;

		// If (the user gave us a category AND the only channel in there is listed as a protectedChannel) return err message
		if (channel.type === 'GUILD_CATEGORY' && (!deletable || deletable.size < 1)) {
			return interaction.followUp(`❌ There's no channels in **${channel.name}** that I'm able to delete!`);
		}

		const row = new MessageActionRow()
		.addComponents(
			new MessageButton()
				.setCustomId('cleanChannels')
				.setLabel('Just do it')
				.setStyle('SUCCESS'),
			new MessageButton()
				.setCustomId('cancelClean')
				.setLabel('Marty Im scared')
				.setStyle('DANGER'),
		);

		const confirmEmbed = new MessageEmbed()
			.setColor(color.warn)
			.addFields({ name: 'Delete the following channel(s)? ⚠', value: deletable.map(c => `\n\t - ${c.name}`).join('') })

		const completeEmbed = new MessageEmbed()
			.setColor(color.success)
			.addFields({ name: 'The following channel(s) have been deleted ✅', value: deletable.map(c => `\n\t - ~~${c.name}~~`).join('') })

		const scaredEmbed = new MessageEmbed()
			.setColor(color.err)
			.addFields({ name: 'Dont worry 😹', value: 'No channels were deleted'})

		const errEmbed = new MessageEmbed()
			.setColor(color.err)
			.addFields({ name: 'Uhoh an error occured😨', value: 'Ask Huge Dad to look into it'})

		// This will display the confirmation embed with the accept/decline buttons
		const confirm = await interaction.followUp({ content: 'test', embeds: [confirmEmbed], components: [row], ephemeral: true });

		// This will attach a collector to our confirmation buttons, so that we can do something
		const collector = confirm.createMessageComponentCollector({ componentType: 'BUTTON', time: 15000 });

		// Flag to be set to true after we delete channels successfully
		let successfullyDeleted = false;

		// When someone clicks a button ('continue' OR 'cancel' button)..
		collector.on('collect', i => {

			// Make that someone is the same person who originally ran the 'clean' command
			if (i.user.id !== interaction.user.id) {
				i.reply({ content: 'Those buttons arent for you!', ephemeral: true });
			}

			// If they hit the 'continue' button..
			if (i.customId === 'cleanChannels') {
				try {
					deletable.forEach( c =>  c.delete() );
				} catch(error) {
					console.error(error);
					confirm.edit({ embeds: [errEmbed], components: [] });
					collector.stop();
					return;
				}
				successfullyDeleted = true;
				confirm.edit({ embeds: [completeEmbed], components: [] });
				collector.stop();
				return;
			}
			// If they hit the 'cancel' button..
			else if (i.customId === 'cancelClean') {
				confirm.edit({ embeds: [scaredEmbed], components: [] });
				collector.stop();
				return;
			}

		});

		// End button-collector event listener
		collector.on('end', collected => {
			if(successfullyDeleted) return;
			confirm.edit({ embeds: [scaredEmbed], components: [] });
		});
	}
}
