const BaseCommand = require('../../utils/structures/BaseCommand');

module.exports = class server extends BaseCommand {
	constructor() {
		super({
			name: 'server',
			category: 'utility',
			description: 'Display info about the server',
			requiredPermission: 'ANY',
		});
	}

	async run(client, message) {
		message.channel.send(`Server name: ${message.guild.name}\nTotal members: ${message.guild.memberCount}`);
	}
};