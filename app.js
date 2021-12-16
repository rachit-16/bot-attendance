require('dotenv').config({ path: '.env' })
const express = require('express')
const expressSession = require('express-session')
const expressLayouts = require('express-ejs-layouts')
const mongoose = require('mongoose')
const passport = require('passport')
const passportLocal = require('passport-local')

const User = require('./models/user')
const authRoutes = require('./routes/auth')
const userRoutes = require('./routes/user')
const meetingRoutes = require('./routes/meeting')
const { isLoggedIn } = require('./middlewares/auth')

const app = express()
const LocalStrategy = passportLocal.Strategy
const PORT = process.env.PORT
const MONGODB_URL =
  'mongodb+srv://rachit:rachit@cluster0.ciwda.mongodb.net/bot-attendance?retryWrites=true&w=majority'
// const MONGODB_URL = process.env.MONGO_URL

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
app.use('/api/meetings', isLoggedIn, meetingRoutes)
app.use('/api/user', isLoggedIn, userRoutes)

app.get('/', (req, res) => {
  res.redirect('/api/auth')
})

app.listen(PORT, () => {
  console.log(`Server is up on port ${PORT}`)
})
