const EmailGroup = require('./../model');

const deleteEmailGroup = async (req, res) => {
	try {
		const emailGroupId = req.params.id;

		EmailGroup.deleteOne({ _id: emailGroupId }, (err) => {
			if (err) {
				return res.status(400).json({ error: err.message });
			}
			return res
				.status(200)
				.json({ success: 'Email Group deleted successfully.' });
		});
	} catch (error) {
		return res.status(400).json({ error: error.message });
	}
};

module.exports = deleteEmailGroup;
