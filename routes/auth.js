const express = require('express')
const passport = require('passport')
const User = require('../models/user')

const { isLoggedIn, isNotLoggedIn } = require('../middlewares/auth')

const router = express.Router()

router.get('/login', isNotLoggedIn, (req, res) => {
	// res.send('login page')
	console.log('login')
	res.render('LoginPage/login')
})

router.get('/signup', isNotLoggedIn, (req, res) => {
	// res.send('signup page')
	res.render('SignupPage/signup')
})

router.get('/logout', isLoggedIn, (req, res) => {
	req.logout()
	console.log('logged out')
	res.redirect('/api/auth/login')
})

//handling user login
router.post(
	'/login',
	isNotLoggedIn,
	passport.authenticate('local', {
		successRedirect: '/api/user/meetings',
		failureRedirect: '/api/auth/login',
	}),
	(req, res) => {
		console.log('signed in! ' + JSON.stringify(req.body))
		res.send()
	}
)

//handling user signup
router.post('/signup', isNotLoggedIn, async (req, res) => {
	// isNotLoggedIn
	const { name, email, username, password, password2 } = req.body

	const errors = []
	// check required fields
	if (!name || !email || !username || !password || !password2) {
		errors.push('Please fill in all fields!')
	}

	// check both passwords match
	if (password !== password2) {
		errors.push('Passwords do not match!')
	}

	// check password length
	if (password.length < 6) {
		errors.push('Password should contain atleast 6 characters!')
	}

	// return errors, if any
	if (errors.length > 0) {
		return res.status(400).send(errors)
	}

	// continue, if no error
	User.findOne({ email })
		.then((error, existingUser) => {
			if (error || existingUser) {
				return res.status(400).send('Email already exists!')
			}

			User.register(new User({ name, email, username, password }), password, (err, user) => {
				if (err) {
					console.log(err)
					return res.status(400).send(err)
					// return res.render('SignupPage/signup')
				}
				//user stragety
				passport.authenticate('local')(req, res, () => {
					//once the user sign up
					console.log('signed up!' + JSON.stringify(user))
					res.redirect('http://localhost:3000/api/user/meetings')
				})
			})
		})
		.catch((error) => {
			res.status(500).send(error)
		})
})

module.exports = router
