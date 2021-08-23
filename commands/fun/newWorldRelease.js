const BaseCommand = require('../../utils/structures/BaseCommand');

module.exports = class newWorldRelease extends BaseCommand {
	constructor() {
		super({
			name: 'release',
			category: 'fun',
			description: 'Get the most up to date news on New Worlds release',
			requiredPermission: 'ANY',
		});
	}

	async run(client, message) {
		message.channel.send('Here is the latest news on the New World release date', { files: ['img/newWorldRelease.jpg'] });
	}
};