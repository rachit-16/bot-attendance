require('dotenv').config({ path: '.env' })
const express = require('express')
const expressSession = require('express-session')
const expressLayouts = require('express-ejs-layouts')
const mongoose = require('mongoose')
const passport = require('passport')
const passportLocal = require('passport-local')

const User = require('./models/user')
const Meeting = require('./models/meeting')
const authRoutes = require('./routes/auth')
const userRoutes = require('./routes/user')
const meetingRoutes = require('./routes/meeting')
const botRoutes = require('./routes/bot')
const { isLoggedIn } = require('./middlewares/auth')

const app = express()
const LocalStrategy = passportLocal.Strategy
const MONGODB_URL = process.env.MONGO_URL
const PORT = process.env.PORT

// express server config
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(
  expressSession({
    secret: 'Rusty is the best og in the worldpassport ',
    resave: false,
    saveUninitialized: false,
  })
)

// ejs config
app.set('view engine', 'ejs')
app.use(expressLayouts)
app.set('layout', 'Layout/layout')

// passport config
app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

// mongoose config
mongoose
  .connect(MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log('db connected!')
  })
  .catch((error) => {
    console.error(error)
  })

// routes
app.use('/api/auth', authRoutes)
app.use('/api/user', isLoggedIn, userRoutes)
app.use('/api/user/meetings', isLoggedIn, meetingRoutes)
app.use('/api/user/bots', isLoggedIn, botRoutes)

app.get('/', (req, res) => {
  res.redirect('/api/auth/login')
})

app.post('/attendance/:botId', async (req, res) => {
  console.info('GOT ATTENDANCE:\n', req.body)
  const { taker, date, time, data, url } = req.body
  const { botId } = req.params
  const attendees = data.split('@').map((attendee) => {
    return {
      name: attendee,
    }
  })
  attendees.pop()

  try {
    const newAttendance = new Meeting({
      link: url,
      participantsCount: attendees.length,
      date,
      time,
      host: new mongoose.Types.ObjectId(), // change this to get data from URL
      hostName: taker,
      participants: attendees,
    })

    console.log(newAttendance)
    await newAttendance.save()
    res.status(201).send(newAttendance)
  } catch (error) {
    res.status(400).send(error)
  }
})

app.listen(PORT, () => {
  console.log(`Server is up on port ${PORT}`)
})
