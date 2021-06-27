const mongoose = require('mongoose');

const { userSchema } = require('./../model');
const User = new mongoose.model('User', userSchema);

const emailGroupSchema = mongoose.Schema({
	owner: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
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
