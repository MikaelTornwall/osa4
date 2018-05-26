const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (req, res) => {
  const users = await User
  .find({})
  .populate('blogs', { likes: 1, author: 1, title: 1, url: 1 })
  res.json(users.map(User.format))
})

usersRouter.post('/', async (req, res) => {
  try {
    const body = req.body

    const existingUser = await User.find({ username: body.username })
    if (existingUser.length > 0) {
      return res.status(400).json({ error: 'username is already taken' })
    }

    if (body.password.length < 3) {
      return res.status(400).json({ error: 'password must be at least three characters long' })
    }

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(body.password, saltRounds)

    const user = new User({
      username: body.username,
      name: body.username,
      passwordHash,
      adult: body.adult === undefined ? true : body.adult
    })

    const savedUser = await user.save()

    res.json(User.format(savedUser))
  } catch (exception) {
    console.log(exception)
    res.status(500).json({ error: 'something went very wrong' })
  }
})

module.exports = usersRouter
