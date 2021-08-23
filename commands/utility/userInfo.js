const BaseCommand = require('../../utils/structures/BaseCommand');

module.exports = class userInfo extends BaseCommand {
	constructor() {
		super({
			name: 'userInfo',
			category: 'utility',
			description: 'Display info about yourself',
			requiredPermission: 'ANY',
		});
	}

	async run(client, message) {
		message.channel.send(`Your username: ${message.author.username}\nYour ID: ${message.author.id}`);
	}
};