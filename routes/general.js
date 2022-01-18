const express = require('express')
const Meeting = require('../models/meeting')
const mongoose = require('mongoose')

const router = express.Router()

router.get('/about', (req, res) => {
	res.render('AboutPage/about')
})

router.get('/meeting-details', async (req, res) => {
	const finalUserMeetings = []

	let userMeetings
	try {
		userMeetings = await Meeting.find({ host: req.user._id })
		// userMeetings = await Meeting.find({})
	} catch (error) {
		res.status(500).send(error)
	}

	userMeetings.forEach((element) => {
		const elementDateTime = new Date(`${element.date}T${element.time}:00`)

		if (elementDateTime - new Date() > 0) {
			finalUserMeetings.push(element)
		}
	})

	// console.log(userMeetings);

	res.render('ScheduledMeetings/ScheduledMeetings', {
		username: req.user.username,
		meetings: finalUserMeetings,
	})
})

router.post('/attendance/:hostId', async (req, res) => {
	const { taker, dateTime, data, url } = req.body
	const { hostId } = req.params
	console.info('GOT ATTENDANCE:\n', req.body, hostId)
	const attendees = data.split('@').map((attendee) => {
		return {
			name: attendee,
		}
	})
	attendees.pop()

	const datetime = new Date(dateTime)

	const pad = (n) => (n < 10 ? '0' + n : n)

	const date = [
		datetime.getFullYear(),
		'-',
		pad(datetime.getMonth() + 1),
		'-',
		pad(datetime.getDate()),
	].join('')

	const time = [pad(datetime.getHours()), ':', pad(datetime.getMinutes())].join('')

	console.log(attendees)

	try {
		const newAttendance = new Meeting({
			link: url,
			participantsCount: attendees.length,
			date,
			time,
			host: mongoose.Types.ObjectId(hostId),
			hostName: taker,
			participants: attendees,
		})

		console.log('new::', newAttendance)
		await newAttendance.save()
		res.status(201).send(newAttendance)
	} catch (error) {
		console.log('not saved to db: ' + error)
		res.status(400).send(error)
	}
})

module.exports = router
