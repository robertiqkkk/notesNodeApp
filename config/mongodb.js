const mongoose = require("mongoose");
const config = require("../utils/config");
const logger = require("../utils/logger");

const connect = () => {
	logger.info("connecting to", config.MONGODB_URI);
	return mongoose
		.connect(config.MONGODB_URI, { family: 4 })
		.then(() => {
			logger.info("connected to MongoDB");
		})
		.catch((error) => {
			logger.error("error connection to MongoDB:", error.message);
		});
};
module.exports = { connect };
