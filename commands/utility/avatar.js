const BaseCommand = require('../../utils/structures/BaseCommand');

module.exports = class avatar extends BaseCommand {
	constructor() {
		super('avatar', 'utility', ['icon', 'pfp'], 'avatar [@user]', 'Gets a users avatar picture', 'ANY');
	}

	async run(client, message) {
		if (!message.mentions.users.size) {
			return message.channel.send(`Your avatar: <${message.author.displayAvatarURL({ dynamic: true })}>`);
		}

		const avatarList = message.mentions.users.map(user => {
			return `${user.username}'s avatar: <${user.displayAvatarURL({ dynamic: true })}>`;
		});

		message.channel.send(avatarList);
	}
};