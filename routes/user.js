const express = require('express')
const User = require('../models/user')
const Meeting = require('../models/meeting')

const router = express.Router()

// access dashboard
router.get('/dashboard', async (req, res) => {
	res.status(404).send()
	// res.send('logged in!')
	// console.log('dashboard')

	// let userMeetings
	// try {
	// 	userMeetings = await Meeting.find({ host: req.user._id }).sort({ date: -1, time: -1 }).limit(6)
	// 	// userMeetings = await Meeting.find({})
	// } catch (error) {
	// 	res.status(500).send(error)
	// }
	// res.render('Dashboard/dashboard', { meetings: userMeetings, username: req.user.username })
})

// access user profile
// !! REVIEW PROFILE DATA SENT !!
router.get('/profile', async (req, res) => {
	try {
		const user = await User.findById(req.user._id)
		if (!user) {
			return res.status(404).send()
		}
		res.send(user)
	} catch (error) {
		res.status(500).send(error)
	}
})

// receive attendance

// delete user
router.delete('/delete', async (req, res) => {
	try {
		await req.user.remove()
		res.send(req.user)
	} catch (error) {
		res.status(500).send(error)
	}
})

module.exports = router
