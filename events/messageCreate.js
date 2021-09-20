const client = require('../index');
const UserModel = require('../models/user');

client.on('messageCreate', async (message) => {
	// if (message.author.bot || !message.guild || !message.content.toLowerCase().startsWith(client.config.prefix)) return;
	if (message.author.bot) return;
	console.log(message.author.username);
	const userRoles = [];
	message.member.roles.cache.forEach((r) => userRoles.push(r.name));

	let userData;

	try {
		userData = await UserModel.findOne({ userID: message.author.id });
		if (!userData) {
			const newUser = await UserModel.create({
				userID: message.author.id,
				username: message.author.username,
				serverID: message.guild.id,
				roles: userRoles,
				firstSeen: message.createdTimestamp.toString(),
			});
			newUser.save();
		}
	} catch (error) {
		console.error(error);
	}

	const [cmd, ...args] = message.content
		.slice(client.config.prefix.length)
		.trim()
		.split(' ');

	const command =
		client.commands.get(cmd.toLowerCase()) ||
		client.commands.find((c) => c.aliases?.includes(cmd.toLowerCase()));

	if (!command) return;
	await command.run(client, message, args, userData);
});
