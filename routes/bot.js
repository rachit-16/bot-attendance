const express = require('express')
const Bot = require('../models/bot')
const Meeting = require('../models/meeting')
const moment = require('moment-timezone')

const router = express.Router()

// get all bots of a user
// GET /api/user/bots?search=model_field:value
// GET /api/user/bots?limit=10&skip=10
// GET /api/user/bots?sortBy=time:desc
// !! REVIEW SEARCH !!
router.get('/', async (req, res) => {
	const { search, limit, skip, sortBy } = req.query

	const match = {}
	const sort = {}

	if (search) {
		const parts = search.split(':')
		match[parts[0]] = parts[1]
	}

	if (sortBy) {
		const parts = sortBy.split(':')
		sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
	}

	try {
		await req.user
			.populate({
				path: 'userBots',
				match,
				options: {
					limit: parseInt(limit),
					skip: parseInt(skip),
					sort,
				},
			})
			.execPopulate()

		const finalUserMeetings = []
		req.user.userBots.forEach((element) => {
			const elementDateTime = moment(`${element.date}T${element.time}:00+05:30`)

			if (elementDateTime.diff(moment().tz('Asia/Calcutta')) > 0) {
				finalUserMeetings.push(element)
			}
		})

		// console.log('1->', req.user.userBots)
		// console.log('2->', finalUserMeetings)
		// console.log('3->', req.user)

		// res.render('ScheduledMeetings/scheduledMeetings', {
		// 	username: req.user.username,
		// 	meetings: finalUserMeetings,
		// })
	} catch (error) {
		res.status(500).send(error)
	}
})

// edit bot details
// !! REVIEW EDITABLE FIELDS !!
router.post('/edit/:botId', async (req, res) => {
	const { botId } = req.params
	const allowedUpdates = ['name', 'meetLink', 'time', 'ownerName']
	const updates = Object.keys(req.body)
	const isValidRequest = updates.every((update) => allowedUpdates.includes(update))

	if (!isValidRequest) {
		return res.status(400).send({ error: 'Invalid Updates!' })
	}

	try {
		const bot = await Bot.findOne({ _id: botId, owner: req.user._id })

		if (!bot) {
			return res.status(404).send()
		}

		// validate time

		updates.forEach((update) => (bot[update] = req.body[update]))
		await bot.save()
		res.send(bot)
	} catch (error) {
		res.status(400).send(error)
	}
})

// add a new bot for a user
router.post('/new', async (req, res) => {
	const { name, meetLink, time, ownerName } = req.body

	try {
		const newBot = new Bot({ name, meetLink, time, ownerName, owner: req.user._id })
		console.log(newBot)
		await newBot.save()
		res.status(201).send(newBot)
	} catch (error) {
		res.status(400).send(error)
	}
})

// delete an existing bot
router.delete('/delete/:botId', async (req, res) => {
	const { botId } = req.params

	try {
		const bot = await Bot.findOneAndDelete({
			_id: botId,
			owner: req.user._id,
		})

		if (!bot) {
			return res.status(404).send()
		}

		res.send(bot)
	} catch (error) {
		res.status(500).send()
	}
})

// delete all bots of a user
router.delete('/deleteAll', async (req, res) => {
	try {
		const bots = await Bot.deleteMany({ owner: req.user._id })

		if (!bots) {
			return res.status(404).send()
		}

		res.send(bots)
	} catch (error) {
		res.status(500).send(error)
	}
})

// sheuled meetings

router.get('/sheduled', async (req, res) => {
	const finalUserMeetings = []

	let userMeetings
	try {
		userMeetings = await Meeting.find({ host: req.user._id })
		// userMeetings = await Meeting.find({})
	} catch (error) {
		res.status(500).send(error)
	}

	userMeetings.forEach((element) => {
		const elementDateTime = moment(`${element.date}T${element.time}:00+05:30`)

		if (elementDateTime.diff(moment().tz('Asia/Calcutta')) > 0) {
			finalUserMeetings.push(element)
		}
	})

	// console.log(userMeetings);

	res.render('ScheduledMeetings/ScheduledMeetings', {
		username: req.user.username,
		meetings: finalUserMeetings,
	})
})

module.exports = router
