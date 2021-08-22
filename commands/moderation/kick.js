const BaseCommand = require('../../utils/structures/BaseCommand');

module.exports = class kick extends BaseCommand {
	constructor() {
		super('kick', 'moderation', ['boot'], 'kick [@user]', 'Boots a user from the server', 'MOD');
	}

	async run(client, message) {
		if (!message.mentions.users.size) return message.reply('you need to tag a user in order to kick them!');

		const taggedUser = message.mentions.users.first();

		message.channel.send(`You wanted to kick: ${taggedUser.username}`);
	}
};