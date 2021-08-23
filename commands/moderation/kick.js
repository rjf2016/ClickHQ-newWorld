const BaseCommand = require('../../utils/structures/BaseCommand');

module.exports = class kick extends BaseCommand {
	constructor() {
		super({
			name: 'kick',
			category: 'moderation',
			aliases: ['boot'],
			usage: 'kick [@user]',
			description: 'Boots a user from the server',
			requiredPermission: 'MOD',
		});
	}

	async run(client, message) {
		if (!message.mentions.users.size) return message.reply('you need to tag a user in order to kick them!');

		const taggedUser = message.mentions.users.first();

		message.channel.send(`You wanted to kick: ${taggedUser.username}`);
	}
};