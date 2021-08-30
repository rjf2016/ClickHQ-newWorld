module.exports = {
	name: 'release',

	run: async (client, message) => {
		message.channel.send('Here is the latest news on the New World release date', { files: ['img/newWorldRelease.jpg'] });
	},

};
