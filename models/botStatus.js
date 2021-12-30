const mongoose = require('mongoose')

const botStatusSchema = new mongoose.Schema({
  
  meetLink: {
    type: String,
    required: true,
  },
  timeTaken: {
    type: String,
    required: true,
  },
  entryStatus:{
      type: Boolean,
      required: true
  }
})

const BotStatus = mongoose.model('BotStatus', botStatusSchema)

module.exports = BotStatus
