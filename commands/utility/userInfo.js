const BaseCommand = require('../../utils/structures/BaseCommand');

module.exports = class userInfo extends BaseCommand {
	constructor() {
		super('userInfo', 'utility', [], 'userInfo', 'Displays basic info about yourself', 'ANY');
	}

	async run(client, message) {
		message.channel.send(`Your username: ${message.author.username}\nYour ID: ${message.author.id}`);
	}
};