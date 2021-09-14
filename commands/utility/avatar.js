module.exports = {
	name: 'avatar',
	aliases: ['icon', 'pfp'],
	run: async (client, message) => {
		if (!message.mentions.users.size) return message.channel.send(`Your avatar: <${message.author.displayAvatarURL({ dynamic: true })}>`);

		const avatarList = message.mentions.users.map(user => {
			return message.channel`${user.username}'s avatar: <${user.displayAvatarURL({ dynamic: true })}>`;
		});

		message.channel.send(avatarList);
	},
};