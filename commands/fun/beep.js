const BaseCommand = require('../../utils/structures/BaseCommand');

module.exports = class beep extends BaseCommand {
	constructor() {
		super({
			name: 'beep',
			category: 'fun',
			description: 'Get a response from Click Bot',
			requiredPermission: 'ANY',
		});
	}

	async run(client, message) {
		message.channel.send('Boop');
	}
};