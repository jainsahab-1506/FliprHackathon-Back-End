const mongoose = require('mongoose');

const emailGroupSchema = mongoose.Schema({
	owner: {
		type: mongoose.ObjectId,
		required: true,
	},
	groupName: {
		type: String,
		required: true,
	},
	to: {
		type: [{ type: String }],
		required: true,
	},
	cc: {
		type: [{ type: String }],
	},
	bcc: {
		type: [{ type: String }],
	},
});

module.exports = new mongoose.model('Email Group', emailGroupSchema);
