const BaseCommand = require('../../utils/structures/BaseCommand');

module.exports = class server extends BaseCommand {
	constructor() {
		super('server', 'utility', [], 'server', 'Display info about the server', 'ANY');
	}

	async run(client, message) {
		message.channel.send(`Server name: ${message.guild.name}\nTotal members: ${message.guild.memberCount}`);
	}
};