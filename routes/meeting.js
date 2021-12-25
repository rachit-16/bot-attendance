const express = require('express')
const Meeting = require('../models/meeting')

const router = express.Router()

// get all meetings of a user
// GET /api/meetings?search=model_field:value
// GET /api/meetings?limit=10&skip=10
// GET /api/meetings?sortBy=date:desc
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
        path: 'userMeetings',
        match,
        options: {
          limit: parseInt(limit),
          skip: parseInt(skip),
          sort,
        },
      })
      .execPopulate()

    res.send(req.user.userMeetings)
  } catch (error) {
    res.status(500).send(error)
  }
})

// get all details of a meeting
router.get('/details/:meetId', async (req, res) => {
  const { meetId } = req.params
  try {
    const meeting = await Meeting.findOne({ _id: meetId, host: req.user._id })
    if (!meeting) {
      return res.status(404).send()
    }
    await meeting.populate('host').execPopulate()
    res.send(meeting)
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

    updates.forEach((update) => (meeting[update] = req.body[update]))
    await meeting.save()
    res.send(meeting)
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
    res.send(meeting)
  } catch (error) {
    res.status(400).send(error)
  }
})

// add a new meeting record for a user
router.post('/new', async (req, res) => {
  const { link, date, time, hostName } = req.body
  // let date, time
  // if(req.body.date){
  //   date = req.body.date
  // }
  // if(req.body.time){
  //   date = req.body.date
  // }

  try {
    const newMeeting = new Meeting({ link, date, time, hostName, host: req.user._id })
    console.log(newMeeting)
    await newMeeting.save()
    res.status(201).send(newMeeting)
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

    res.send(meeting)
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
