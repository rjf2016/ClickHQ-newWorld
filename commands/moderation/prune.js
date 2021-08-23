const BaseCommand = require('../../utils/structures/BaseCommand');

module.exports = class prune extends BaseCommand {
	constructor() {
		super({
			name: 'prune',
			category: 'moderation',
			usage: 'prune [number]',
			description: 'Delete messages from current channel',
			requiredPermission: 'MOD',
		});
	}

	async run(message, args) {
		const amount = parseInt(args[0]) + 1;

		if (isNaN(amount)) {
			return message.reply('thats not a valid number');
		}
		else if (amount <= 1 || amount > 100) {
			return message.reply('you need to input a number between 1 and 99.');
		}

		message.channel.bulkDelete(amount, true).catch(err => {
			console.error(err);
			message.channel.send('there was an error trying to prune messages in this channel!');
		});
	}
};