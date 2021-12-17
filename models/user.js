const mongoose = require('mongoose')
const passportLocalMongoose = require('passport-local-mongoose')
const Meeting = require('./meeting')

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    lowercase: true,
  },
  username: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
})

userSchema.virtual('userMeetings', {
  ref: 'Meeting',
  localField: '_id',
  foreignField: 'host',
})

// delete all meetings of a user, if user is removed
userSchema.pre('remove', async function (next) {
  const user = this
  await Meeting.deleteMany({ host: user._id })
  next()
})

userSchema.plugin(passportLocalMongoose)

module.exports = mongoose.model('User', userSchema)
