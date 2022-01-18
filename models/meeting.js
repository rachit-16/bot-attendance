const mongoose = require('mongoose')

const MeetingSchema = new mongoose.Schema({
	platform: {
		type: String,
		default: 'google_meet',
		enum: ['google_meet', 'ms_teams', 'zoom'],
		trim: true,
		lowercase: true,
	},
	link: {
		type: String,
		required: true,
		trim: true,
		lowercase: true,
	},
	participantsCount: {
		type: Number,
		default: 0,
	},
	date: {
		type: String,
		default: () => {
			const dateTime = new Date()
			return [dateTime.getFullYear(), '-', dateTime.getMonth() + 1, '-', dateTime.getDate()].join(
				''
			)
		},
	},
	time: {
		type: String,
		default: () => {
			const dateTime = new Date()
			return [dateTime.getHours(), ':', dateTime.getMinutes()].join('')
		},
	},
	host: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		ref: 'User',
	},
	hostName: {
		type: String,
		required: true,
		trim: true,
	},
	participants: [
		{
			name: {
				type: String,
				trim: true,
			},
			isPresent: {
				type: Boolean,
				default: true,
			},
		},
	],
})

const Meeting = mongoose.model('Meeting', MeetingSchema)

module.exports = Meeting
