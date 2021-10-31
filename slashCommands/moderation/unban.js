const { MessageEmbed } = require('discord.js');
const { color } = require('../../config.json');

// TODO: (same as ban command) should be saving ban data to DB
module.exports = {
	name: 'unban',
	description: 'Unban a user from the server',
	userPermissions: ['ADMINISTRATOR'],
	category: 'moderation',
	type: 1,
	options: [
		{
			name: 'user',
			description: 'The user to unban',
			type: 'USER',
			required: true,
		},
		{
			name: 'invite',
			description: 'If true, an invite will be sent to the banned user',
			type: 'BOOLEAN',
			required: false,
		},
	],

	run: async ({ client, interaction }) => {
		const id = interaction.options.get('user')?.value;
		const invite = interaction.options.getBoolean('invite');

		const ban = await interaction.guild.bans.fetch(id);
		const bannedUserName = await ban.user.username;

		if (!ban) {
			return interaction.followUp({ embeds: [new MessageEmbed().setColor(color.err).setDescription(`❌ Uhoh, I wasnt able to unban ${bannedUserName}`)] });
		}

		interaction.guild.bans.remove(id)
			.then(userInfo => interaction.followUp({ embeds: [new MessageEmbed().setColor(color.success).setDescription(`**${bannedUserName}** was unbanned by **${interaction.user.username}**`)] }))
			.catch(console.error)
	}
}