module.exports = {
	name: 'kick',
	aliases: ['boot'],

	async run(client, message) {
		if (!message.mentions.users.size) return message.reply('you need to tag a user in order to kick them!');

		const taggedUser = message.mentions.users.first();

		message.channel.send(`You wanted to kick: ${taggedUser.username}`);
	},
};