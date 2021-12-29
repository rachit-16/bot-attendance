const express = require('express')
const Meeting = require('../models/meeting')

const router = express.Router()

router.get('/about', (req, res) => {
	res.render('AboutPage/about')
})

router.post('/attendance/:botId', async (req, res) => {
	console.info('GOT ATTENDANCE:\n', req.body)
	const { taker, date, time, data, url } = req.body
	const { botId } = req.params
	const attendees = data.split('@').map((attendee) => {
		return {
			name: attendee,
		}
	})
	attendees.pop()

	try {
		const newAttendance = new Meeting({
			link: url,
			participantsCount: attendees.length,
			date,
			time,
			host: new mongoose.Types.ObjectId(), // change this to get data from URL
			hostName: taker,
			participants: attendees,
		})

		console.log(newAttendance)
		await newAttendance.save()
		res.status(201).send(newAttendance)
	} catch (error) {
		res.status(400).send(error)
	}
})

module.exports = router
