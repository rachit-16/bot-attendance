const express = require('express')
const Meeting = require('../models/meeting')

const router = express.Router()
const dotenv = require('dotenv')


dotenv.config()

// get all meetings of a user
// GET /api/user/meetings?search=model_field:value
// GET /api/user/meetings?limit=10&skip=10
// GET /api/user/meetings?sortBy=date:desc
// !! REVIEW SEARCH !!
router.get('/', async (req, res) => {
	const { search, limit = '6', skip = '0', sortBy, scheduled = 'false' } = req.query

	const match = {}
	let sort = { date: -1, time: -1 }

	if (search) {
		const parts = search.split(':')
		match[parts[0]] = { $regex: parts[1], $options: 'i' }
	}

	if (sortBy) {
		sort = {}
		const parts = sortBy.split(':')
		sort[parts[0]] = parts[1] === 'asc' ? 1 : -1
	}

	try {
		let userMeetings = await Meeting.find({ host: req.user._id, ...match })
			.sort(sort)
			.skip(parseInt(skip))
			.limit(parseInt(limit))

		// .populate({
		// 	path: 'userMeetings',
		// 	match,
		// 	options: {
		// 		limit: parseInt(limit),
		// 		skip: parseInt(skip),
		// 		sort,
		// 	},
		// })
		// .execPopulate()

		// console.log('-->', req.user.userMeetings)

		// req.user.userMeetings.sort((x, y) => {
		// 	const dateTime1 = new Date(`${x.date}T${x.time}:00`)
		// 	const dateTime2 = new Date(`${y.date}T${y.time}:00`)

		// 	return dateTime1 > dateTime2
		// })

		if (scheduled == 'true') {
			userMeetings = userMeetings.filter((element) => {
				const elementDateTime = new Date(`${element.date}T${element.time}:00`)
				if (elementDateTime - new Date() > 0) {
					return true
				}
			})
			res.render('ScheduledMeetings/ScheduledMeetings', {
				meetings: userMeetings,
				username: req.user.username,
			})
			return
		}

		res.render('Dashboard/Dashboard', { meetings: userMeetings, username: req.user.username })
	} catch (error) {
		res.status(500).send(error)
	}
})

// get all details of a meeting
router.get('/details/:meetId', async (req, res) => {
	const { meetId } = req.params
	try {
		const meeting = await Meeting.findOne({ _id: meetId, host: req.user._id })
		// const meeting = await Meeting.findOne({ _id: meetId })
		if (!meeting) {
			return res.status(404).send()
		}
		await meeting.populate('host').execPopulate()
		// res.send(meeting)
		res.render('MeetingDetails/meeting-details', { meeting })
	} catch (error) {
		res.status(500).send(error)
	}
})

// edit a meeting record
// !! REVIEW EDITABLE FIELDS !!
router.post('/edit/:meetId', async (req, res) => {
	const { meetId } = req.params
	const allowedUpdates = ['date', 'time', 'hostName']
	const updates = Object.keys(req.body)
	const isValidRequest = updates.every((update) => allowedUpdates.includes(update))

	if (!isValidRequest) {
		return res.status(400).send({ error: 'Invalid Updates!' })
	}

	try {
		const meeting = await Meeting.findOne({ _id: meetId, host: req.user._id })

		if (!meeting) {
			return res.status(404).send()
		}

		// validate date, time
		updates.forEach((update) => {
			const newVal = req.body[update]
			if (newVal) {
				meeting[update] = newVal
			}
		})

		await meeting.save()
		console.log('updated!')
		// console.log('edit req->', req.url, req.baseUrl, req.originalUrl)
		// console.log('edit req->2', req.headers, req.query)
		res.redirect(req.headers.referer)
	} catch (error) {
		res.status(400).send(error)
	}
})

// add a participant to a meeting
router.post('/:meetId/addParticipant', async (req, res) => {
	const { meetId } = req.params
	const { name, isPresent = true } = req.body

	try {
		const meeting = await Meeting.findById(meetId)

		if (!meeting) {
			return res.status(404).send()
		}

		meeting.participants.push({ name, isPresent })
		meeting.participantsCount++
		await meeting.save()
		console.log('added!')
		console.log('add req->', req.url, req.baseUrl, req.originalUrl)
		console.log('add req->2', req.headers, req.query)
		res.redirect(`${process.env.SERVER}/api/user/meetings/details/${meetId}`)
	} catch (error) {
		res.status(400).send(error)
	}
})

// add a new meeting record for a user
router.post('/new', async (req, res) => {
	const { link, date, time, hostName } = req.body

	try {
		const newMeeting = new Meeting({
			link,
			hostName,
			date: date || undefined,
			time: time || undefined,
			host: req.user._id,
		})
		console.log(newMeeting)
		await newMeeting.save()
		// res.status(201).send(newMeeting)
		res.redirect(req.headers.referer)
	} catch (error) {
		res.status(400).send(error)
	}
})

// delete an existing meeting record
router.delete('/delete/:meetId', async (req, res) => {
	const { meetId } = req.params

	try {
		const meeting = await Meeting.findOneAndDelete({
			_id: meetId,
			host: req.user._id,
		})

		if (!meeting) {
			return res.status(404).send()
		}

		// console.log('del req->', req.url, req.baseUrl, req.originalUrl)
		// console.log('del req->2', req.headers, req.query)
		res.redirect(req.headers.referer)
	} catch (error) {
		res.status(500).send()
	}
})

// delete all meeting records for a user
router.delete('/deleteAll', async (req, res) => {
	try {
		const meetings = await Meeting.deleteMany({ host: req.user._id })

		if (!meetings) {
			return res.status(404).send()
		}

		res.send(meetings)
	} catch (error) {
		res.status(500).send(error)
	}
})

module.exports = router
