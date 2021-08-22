const BaseCommand = require('../../utils/structures/BaseCommand');

module.exports = class beep extends BaseCommand {
	constructor() {
		super('beep', 'fun', ['wipe'], 'beep', 'Get a response from Click Bot', 'ANY');
	}

	async run(client, message) {
		message.channel.send('Boop');
	}
};