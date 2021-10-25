const client = require('../index');
const { serverRulesChannel, serverRulesMessage } = require('../config.json');


client.on('ready', async () => {
	console.log(`${client.user.tag} is up and ready to go!`);
	client.user.setPresence({
		status: 'available',
		activity: {
			name: 'Chrimbus Carol',
			type: 'STREAMING',
			url: 'https://www.youtube.com/watch?v=FlSHYL9peVc'
		}
	});
	// Cache the server's "rules" channel, and "rules" message
	// client.channels.cache.get(serverRulesChannel).messages.fetch(serverRulesMessage);
});