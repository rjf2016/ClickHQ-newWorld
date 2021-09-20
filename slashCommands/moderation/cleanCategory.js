const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const { color } = require('../../config.json');

// protectedChannels are channels/categories that can't be deleted by this command.
// TODO: protectedChannels should be user defined, and saved to DB
const protectedChannels = ['General', 'Voice Channels', 'Text Channels', 'general', "kushinski's group", 'safe'];

module.exports = {
	name: 'clean',
	description: 'Delete channels from a category',
	userPermissions: ['ADMINISTRATOR'],
	options: [
		{
			name: 'channel',
			description: 'The channel OR category. If given a category, I will delete all channels within that category.',
			type: 'CHANNEL',
			require: true,
		},
	],

	/**
	 * @param {Client} client
	 * @param {CommandInteraction} interaction
	*/

	run: async (client, interaction) => {
		const channel = interaction.options.getChannel('channel');

		if (protectedChannels.includes(channel.name)) return interaction.followUp(`❌ No can do champ. **${channel.name}** is a protected channel or category.`)

		const deletable = channel.type === 'GUILD_CATEGORY' ? channel.children.filter(c => !protectedChannels.includes(c.name)) : channel;
		if (channel.type === 'GUILD_CATEGORY' && deletable.size < 1) return interaction.followUp(`❌ There's no channels in **${channel.name}** that I'm able to delete!`);

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
			.addFields({ name: 'Delete the following channel(s)? ⚠', value: deletable.size > 1 ? deletable.map(c => `\n\t - ${c.name}`).join('') : ` - ${channel.name}`})

		const completeEmbed = new MessageEmbed()
			.setColor(color.success)
			.addFields({ name: 'The following channel(s) have been deleted ✅', value: deletable.size > 1 ? deletable.map(c => `\n\t - ~~${c.name}~~`).join('') : ` - ${channel.name}`})

		const scaredEmbed = new MessageEmbed()
			.setColor(color.err)
			.addFields({ name: 'Dont worry 😹', value: 'No channels were deleted'})

		const errEmbed = new MessageEmbed()
			.setColor(color.err)
			.addFields({ name: 'Uhoh an error occured😨', value: 'Ask Huge Dad to look into it'})

		const confirm = await interaction.followUp({ ephemeral: true, embeds: [confirmEmbed], components: [row] });

		const collector = confirm.createMessageComponentCollector({ componentType: 'BUTTON', time: 15000 });
		let successfullyDeleted = false;

		collector.on('collect', i => {
			if (i.user.id === interaction.user.id) {
				if (i.customId === 'cleanChannels') {
					try {
						deletable.size > 1 ? deletable.forEach(c => c.delete()) : channel.delete();
					} catch(error) {
						console.error(error)
						confirm.edit({ embeds: [errEmbed], components: [] })
						collector.stop();
						return;
					}
					successfullyDeleted = true;
					confirm.edit({ embeds: [completeEmbed], components: [] })
					return;
				}
				else if (i.customId === 'cancelClean') {
					confirm.edit({ embeds: [scaredEmbed], components: [] });
					collector.stop();
					return;
				}
			} else if(i.user.id !== interaction.user.id) {
				i.reply({ content: 'Those buttons arent for you!', ephemeral: true })
			}
		})
		collector.on('end', collected => {
			if(successfullyDeleted) return;
			confirm.edit({ embeds: [scaredEmbed], components: [] })
		});
	}
}
