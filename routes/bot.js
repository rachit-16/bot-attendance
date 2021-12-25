const express = require('express')
const Bot = require('../models/bot')

const router = express.Router()

// get all bots of a user
// GET /api/meetings?search=model_field:value
// GET /api/meetings?limit=10&skip=10
// GET /api/meetings?sortBy=time:desc
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

    res.send(req.user.userBots)
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

module.exports = router
