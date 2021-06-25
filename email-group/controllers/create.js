const EmailGroup = require('./../model');

const createEmailGroup = async (req, res) => {
	try {
		const emailGroupData = req.body;

		const emailGroup = await EmailGroup.create(emailGroupData);
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
