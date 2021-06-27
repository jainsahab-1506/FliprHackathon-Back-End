const mongoose = require('mongoose');

const EmailGroup = require('./../model');
const { tokenSchema } = require('../../model');

const Token = new mongoose.model('Token', tokenSchema);

const editEmailGroup = async (req, res) => {
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

		const newEmailGroupData = req.body;
		const emailGroupId = req.params.id;
		const emailGroup = await EmailGroup.findById(emailGroupId);

		if (!emailGroup) {
			return res.status(400).json({
				error: 'Invalid request.',
			});
		}

		console.log(emailGroup);

		const ownerId = emailGroup.owner;
		if (tokenOwner.toString() !== ownerId.toString()) {
			console.log('Expected:', tokenOwner, typeof tokenOwner);
			console.log('Found:', ownerId, typeof ownerId);

			return res.status(400).json({
				error: 'Unauthorized request.',
			});
		}

		const updatedEmailGroup = await EmailGroup.findOneAndUpdate(
			{ _id: emailGroupId },
			newEmailGroupData,
			{ new: true, omitUndefined: true, runValidators: true }
		);

		return res.status(200).json({
			success: 'Email Group successfully updated.',
			emailGroup: updatedEmailGroup,
		});
	} catch (error) {
		return res.status(400).json({ error: error.message });
	}
};

module.exports = editEmailGroup;
