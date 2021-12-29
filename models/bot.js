const mongoose = require('mongoose')

const botSchema = new mongoose.Schema({
	name: {
		type: String,
		default: mongoose.Types.ObjectId,
	},
	meetLink: {
		type: String,
		required: true,
	},
	time: {
		type: String,
		required: true,
	},
	owner: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		ref: 'User',
	},
	ownerName: {
		type: String,
		required: true,
		trim: true,
	},
})

const Bot = mongoose.model('Bot', botSchema)

module.exports = Bot
