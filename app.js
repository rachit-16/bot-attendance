require('dotenv').config({ path: '.env' })
const path = require('path')
const express = require('express')
const expressSession = require('express-session')
const expressLayouts = require('express-ejs-layouts')
const mongoose = require('mongoose')
const passport = require('passport')
const passportLocal = require('passport-local')

const User = require('./models/user')
const generalRoutes = require('./routes/general')
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
console.log(__dirname)
const publicDirPath = path.join(__dirname, '/public')
console.log(publicDirPath)
app.use(express.static(publicDirPath))
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
// app.use(expressLayouts)
// app.set('layout', 'Layout/layout')

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
app.use('/api', generalRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/user', isLoggedIn, userRoutes)
app.use('/api/user/meetings', isLoggedIn, meetingRoutes)
app.use('/api/user/bots', isLoggedIn, botRoutes)

app.get('/', (req, res) => {
	console.log('redirecting to login')
	res.redirect('/api/auth/login')
})

app.listen(PORT, () => {
	console.log(`Server is up on port ${PORT}`)
})

//////////////////////////////// bot///////////////////////////////
// for meet-bot
// const MeetBot = require('./meet-bot')
const { ToadScheduler, SimpleIntervalJob, Task } = require('toad-scheduler')
const BotStatus = require('./models/botStatus')
const scheduler = new ToadScheduler()
const { fork } = require('child_process')
const Bot = require('./models/bot')
const Meeting = require('./models/meeting')
const schedule = require('node-schedule')

let CurrentmeetDetails = []

const TimeNow = new Date().getTime()

// Meeting.find({}).then(
// 	(data)=>{

// 		// const dateTime = moment(`${data.date} ${data.time}`, "YYYY-MM-DD hh:mm" ).format();
// 		// console.log("data : " + data);
// 		console.log("dateTIME : " + dateTime);
// 		console.log("date : " + dateTime.toDate());

// 		console.log("js data : " + new Date());
// 		console.log("diff : " + dateTime - new Date());
// 	}).catch((err)=>{
// 		console.log(err);
// 	});

const callBotFn = (meetLink, id, hostId) => {
	console.log('process 1 started at ', new Date().toString())

	CurrentmeetDetails.forEach((element) => {
		const elementDateTime = new Date(`${element.date}T${element.time}:00`)
		// console.log("process 2 started at " , new Date().toString());
		console.log('element', element)
		// if (element.id === id) {
		console.log(elementDateTime)
		if (elementDateTime - new Date() < 1 * 60 * 1000) {
			// remaining time less than 1 min
			console.log('in child')

			console.log(CurrentmeetDetails)

			element.called = true
			console.log(__dirname, meetLink)
			const childProcess = fork('./meet-bot.js')
			childProcess.send({
				link: meetLink,
				hostId: hostId,
			})

			// childProcess.on('message', (message) => {
			// 	const botStatusUpdate = new BotStatus({
			// 		meetLink: message.meetLink,
			// 		timeTaken: message.time,
			// 		entryStatus: message.entryStatus,
			// 	})

			// 	// console.log(botStatusUpdate)
			// 	botStatusUpdate.save()
			// })

			// remove the meeting done from the array
			CurrentmeetDetails = CurrentmeetDetails.filter(function (value, index, arr) {
				return value.called === false
			})
		}
	})
}

// const task = new Task('simple task', async () => {
// 	// task to be done after every interval
// 	const data = await Meeting.find({})
// 	// console.log('data[0]:::', data[0])

// 	CurrentmeetDetails = []
// 	console.log('in')
// 	data.forEach((element) => {
// 		// console.log("data : " + data);

// 		const dateTime = new Date(`${element.date}T${element.time}:00`)

// 		if (dateTime - new Date() < 15 * 60 * 1000 && dateTime - new Date() > 0) {
// 			// time & Date comparison
// 			CurrentmeetDetails.push({
// 				id: `${Math.random() * 1000000}`,
// 				date: element.date,
// 				time: element.time,
// 				link: element.link,
// 				hostId: element.host,
// 				called: false,
// 			})

// 			console.log('meeting sheduled at: ', dateTime.toString())
// 			console.log('cuurent::: ', CurrentmeetDetails)
// 			const min = dateTime.getMinutes()
// 			const hr = dateTime.getHours()

// 			const job = schedule.scheduleJob(`00 ${min} ${hr} * * *`, () => {
// 				callBotFn(element.link, element.id, element.host)
// 			})
// 		}
// 	})
// })
// const job = new SimpleIntervalJob({ seconds: 10 }, task)

// scheduler.addSimpleIntervalJob(job)
///////////////////////////////////////////////////////////////////
