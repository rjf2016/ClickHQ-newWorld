module.exports = {
	name: 'userInfo',
	category: 'utility',
	description: 'Display info about yourself',

	run: async (client, message) => {
		message.channel.send(`Your username: ${message.author.username}\nYour ID: ${message.author.id}`);
	},

};