module.exports = {
	name: 'server',
	category: 'utility',
	description: 'Display info about the server',

	run: async (client, message) => {
		message.channel.send(`Server name: ${message.guild.name}\nTotal members: ${message.guild.memberCount}`);
	},

};