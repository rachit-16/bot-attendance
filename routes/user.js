const express = require('express')
const User = require('../models/user')

const router = express.Router()

// access dashboard
router.get('/dashboard', (req, res) => {
  res.send('logged in!')
  // res.render('Dashboard/dashboard')
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
