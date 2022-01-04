const express = require('express')
const Meeting = require('../models/meeting')

const router = express.Router()

router.get('/about', (req, res) => {
	res.render('AboutPage/about')
})

router.post('/attendance/:hostId', async (req, res) => {
	const { taker, date, time, data, url } = req.body
	const { hostId } = req.params
	console.info('GOT ATTENDANCE:\n', req.body, hostId)
	const attendees = data.split('@').map((attendee) => {
		return {
			name: attendee,
		}
	})
	attendees.pop()

	console.log(attendees)

	try {
		const newAttendance = new Meeting({
			link: url,
			participantsCount: attendees.length,
			date,
			time,
			// host: mongoose.Types.ObjectId(hostId), // change this to get data from URL
			host: hostId, // change this to get data from URL
			hostName: taker,
			participants: attendees,
		})

		console.log('new::', newAttendance)
		await newAttendance.save()
		res.status(201).send(newAttendance)
	} catch (error) {
		res.status(400).send(error)
	}
})

module.exports = router
