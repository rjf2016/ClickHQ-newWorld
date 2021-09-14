const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
	userID: { type: String, require: true, unique: true },
	username: { type: String },
	serverID: { type: String, require: true },
	roles: [String],
	firstSeen: String,
	newWorldProfile: {
		accountName: { type: String, default: '?' },
		accountLevel: { type: Number, min: 1, max: 65, default: 1 },
		accountClass: { type: String, default: '?' },
		favoriteWeapon: { type: String, default: '?' },
		lastUpdated: { type: String, default: '-' },
	},
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = User;