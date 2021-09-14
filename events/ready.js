const client = require('../index');
const UserModel = require('../models/user');

client.on('ready', async () => {
	console.log(`${client.user.tag} is up and ready to go!`);
	let userData;
	let id = '882004774109732885';
	try {
		userData = await UserModel.findOne({ userID: id });
		if (!userData) {
			const newUser = await UserModel.create({
				userID: id,
				username: 'Clickbot',
				serverID: '871582937391431681',
				roles: ['Robot'],
				newWorldProfile: {
					accountName: 'Clickbot',
					accountLevel: 1,
					accountClass: 'Robotics',
					favoriteWeapon: 'Robo-Fart',
					lastUpdated: 'Just now',
				},
			});
			newUser.save();
		}
	} catch (error) {
		console.error(error);
	}
});