const BaseCommand = require('../../utils/structures/BaseCommand');

module.exports = class ping extends BaseCommand {
	constructor() {
		super({
			name: 'ping',
			category: 'fun',
			description: 'Get a response from Click Bot',
			requiredPermission: 'ANY',
		});
	}

	async run(client, message) {
		message.channel.send('Pong :ping_pong:');
	}
};