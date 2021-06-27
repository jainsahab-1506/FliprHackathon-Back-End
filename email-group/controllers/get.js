const mongoose = require('mongoose');

const EmailGroup = require('./../model');
const { userSchema, tokenSchema } = require('../../model');

const User = new mongoose.model('User', userSchema);
const Token = new mongoose.model('Token', tokenSchema);

const getEmailGroup = async (req, res) => {
	try {
		const authHeader = req.headers.authorization;
		if (!authHeader.startsWith('Bearer ')) {
			return res.status(400).json({
				error: 'Invalid request headers.',
			});
		}

		const tokenData = authHeader.split(' ')[1];

		if (!tokenData) {
			return res.status(400).json({
				error: 'Invalid token.',
			});
		}

		const token = await Token.findOne({ token: tokenData });
		if (!token) {
			return res.status(400).json({
				error: 'Invalid token.',
			});
		}

		const tokenOwner = token.userid;

		const emailGroupId = req.params.id;

		if (!emailGroupId) {
			const emailGroups = await EmailGroup.find({ owner: tokenOwner });
			return res.status(200).json(emailGroups);
		} else {
			const emailGroup = await EmailGroup.findById(emailGroupId);

			if (emailGroup.owner.toString() === tokenOwner.toString()) {
				return res.status(200).json(emailGroup);
			} else {
				return res.status(400).json('You do not own this email group.');
			}
		}
	} catch (error) {
		return res.status(400).json({ error: error.message });
	}
};

module.exports = getEmailGroup;
