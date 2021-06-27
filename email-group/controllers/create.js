const mongoose = require('mongoose');

const EmailGroup = require('./../model');
const { userSchema, tokenSchema } = require('../../model');

const User = new mongoose.model('User', userSchema);
const Token = new mongoose.model('Token', tokenSchema);

const createEmailGroup = async (req, res) => {
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

		const owner = token.userid;

		const emailGroupData = req.body;

		const emailGroup = await EmailGroup.create({ owner, ...emailGroupData });
		if (!emailGroup) {
			return res
				.status(400)
				.json({ error: 'Unable to create a new email group.' });
		}

		return res.status(200).json(emailGroup);
	} catch (error) {
		return res.status(400).json({ error: error.message });
	}
};

module.exports = createEmailGroup;
