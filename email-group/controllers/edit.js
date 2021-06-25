const EmailGroup = require('./../model');

const editEmailGroup = async (req, res) => {
	try {
		const newEmailGroupData = req.body;
		const emailGroupId = newEmailGroupData.id;

		const emailGroup = await EmailGroup.findOneAndUpdate(
			{ _id: emailGroupId },
			newEmailGroupData,
			{ new: true, omitUndefined: true, runValidators: true }
		);

		return res
			.status(200)
			.json({ success: 'Email Group successfully updated.', emailGroup });
	} catch (error) {
		return res.status(400).json({ error: error.message });
	}
};

module.exports = editEmailGroup;
