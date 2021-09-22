const { MessageEmbed } = require('discord.js');
const { guilds } = require('../..');
const { color } = require('../../config.json');

// TODO: add different ban-duration options (eg. 15 minutes, or indefinite) & save banned to DB
module.exports = {
	name: 'ban',
	description: 'Ban a user from the server',
	userPermissions: ['ADMINISTRATOR'],
	category: 'moderation',
	options: [
		{
			name: 'user',
			description: 'The user to ban',
			type: 'USER',
			require: true,
		},
		{
			name: 'duration',
			description: 'Ban duration (in days)',
			type: 'NUMBER',
			require: true,
			choices: [
				{ name: '1 day', value: 1 },
				{ name: '2 days', value: 2 },
				{ name: '3 days', value: 3 },
				{ name: '4 days', value: 4 },
				{ name: '5 days', value: 5 },
				{ name: '6 days', value: 6 },
				{ name: '7 days', value: 7 },
			],
		},
		{
			name: 'reason',
			description: 'The reason for ban',
			type: 'STRING',
			require: true
		},
	],

	/**
	 * @param {Client} client
	 * @param {CommandInteraction} interaction
	*/

	run: async (client, interaction) => {
		const user = interaction.options.getMember('user');
		const reason = interaction.options.getString('reason');
		const duration = interaction.options.getNumber('duration');

		const memberToBan = interaction.guild.members.cache.get(user.id)

		if (user.id === interaction.member.id) {
			return interaction.followUp({ embeds: [new MessageEmbed().setColor(color.err).setDescription('❌ You cant ban yourself.. weirdo')] });
		}

		if (reason.length > 500) {
			return interaction.followUp({ ephemeral: true, embeds: [new MessageEmbed().setColor(color.err).setDescription('❌ Your reason exceeded the 500 character limit!')] });
		}

		// User tried to ban an Admin
		if (interaction.member.roles.highest.position > memberToBan.roles.highest.position) {
			memberToBan.ban({ days: duration, reason: reason })
			return interaction.followUp({ embeds: [new MessageEmbed().setColor(color.dark).setDescription(`**${user.user.username}** has been kicked 👢`).setFields({ name: 'Ban duration', value: `Ban duration: ${duration} day(s)` }, { name: 'Reason', value: `${reason}`})] });
		} else {
			return interaction.followUp({ embeds: [new MessageEmbed().setColor(color.err).setDescription(`😅 **${user.user.username}** has roles equal to or higher than yours! \n \t Awkward..`)] });
		}
	}
};