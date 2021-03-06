const mongoose = require('mongoose');

const guildSchema = mongoose.Schema({
	id: { type: String, required: true },
	prefix: { type: String },
	djrole: { type: String, default: '' },
	musicchannel: { type: String, default: '' },
	defvolume: { type: Number, default: 5 },
	announcesongs: { type: String, default: 'off' },
	maxMemberSongs: { type: Number, default: 10 }
});

module.exports = mongoose.model('Guild', guildSchema);