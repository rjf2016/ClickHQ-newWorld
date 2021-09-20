module.exports = {
	name: 'ping',
	aliases: ['p'],

	run: async (client, message) => {
		message.channel.send(`${client.ws.ping}ms ping`);
	},
};