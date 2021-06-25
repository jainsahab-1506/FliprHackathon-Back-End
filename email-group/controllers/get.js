const EmailGroup = require('./../model');

const getEmailGroup = async (req, res) => {
	try {
		const emailGroupId = req.params.id;

		const emailGroup = await EmailGroup.findById(emailGroupId);
		if (!emailGroup) {
			return res.status(400).json({ error: 'No such email group found.' });
		}

		return res.status(200).json(emailGroup);
	} catch (error) {
		return res.status(400).json({ error: error.message });
	}
};

module.exports = getEmailGroup;
