const EmailGroup = require('./../model');

const getEmailGroup = async (req, res) => {
	try {
		const ownerId = req.params.id;

		const emailGroups = await EmailGroup.find({ owner: ownerId });
		if (!emailGroups) {
			return res.status(400).json({ error: 'Owner has no email groups.' });
		}

		return res.status(200).json(emailGroups);
	} catch (error) {
		return res.status(400).json({ error: error.message });
	}
};

module.exports = getEmailGroup;
