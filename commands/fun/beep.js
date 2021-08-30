module.exports = {
	name: 'beep',
	aliases: ['b'],

	run: async (client, message) => {
		message.channel.send('Beep');
	},
};