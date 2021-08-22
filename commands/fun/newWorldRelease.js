const BaseCommand = require('../../utils/structures/BaseCommand');

module.exports = class newWorldRelease extends BaseCommand {
	constructor() {
		super('release', 'fun', ['release'], 'release', 'ANY');
	}

	async run(client, message) {
		message.channel.send('Here is the latest news on the New World release date', { files: ['img/newWorldRelease.jpg'] });
	}
};