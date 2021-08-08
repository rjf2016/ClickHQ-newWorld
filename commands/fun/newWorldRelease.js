module.exports = {
	name: 'release',
	description: 'New World release date',
	execute(message) {
		message.channel.send('Here is the latest news on the New World release date', {files: ['img/newWorldRelease.jpg']});
	},
};