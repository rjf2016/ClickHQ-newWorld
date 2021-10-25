const mongoose = require('mongoose')

const Schema = new mongoose.Schema({
	guildId: String,
	createdBy: String,
	commandName: String,
	commandDescription: String,
	response: String,
});

module.exports = mongoose.model('custom-commands', Schema)