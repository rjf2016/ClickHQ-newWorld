const BaseCommand = require('../../utils/structures/BaseCommand');

module.exports = class ping extends BaseCommand {
	constructor() {
		super('ping', 'fun', [], 'ping', 'ANY');
	}

	async run(client, message) {
		message.channel.send('Pong :ping_pong:');
	}
};