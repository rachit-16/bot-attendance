module.exports = {
  isLoggedIn: (req, res, next) => {
    if (req.isAuthenticated()) {
      return next()
    }

    res.status(401).send('Unauthorized!')
    // res.redirect('/')
  },
  isNotLoggedIn: (req, res, next) => {
    if (!req.isAuthenticated()) {
      return next()
    }

    res.send('already logged in!')
    // res.redirect('/home')
  },
}
