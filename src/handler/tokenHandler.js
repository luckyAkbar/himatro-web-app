const { forgotPasswordTokenFeature } = require("../feature/forgotPasswordTokenFeature");

const tokenHandler = async (req, res) => {
	const { tokenType } = req.params;

	switch (tokenType) {
		case 'forgot-password':
			await forgotPasswordTokenFeature(req, res);
			break;

		default:
			res.sendStatus(404);
	}
};

module.exports = { tokenHandler };
