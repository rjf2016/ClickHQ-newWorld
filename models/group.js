const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({

});

const Group = mongoose.model('Group', groupSchema);
module.exports = Group;