const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

blogsRouter.get('/', async (req, res) => {
  const blogs = await Blog
  .find({})
  .populate('user', { username: 1, name: 1 })
  res.json(blogs.map(Blog.format))
})

blogsRouter.get('/:id', async (req, res) => {
  try {
    const blog  = await Blog.findById(req.params.id)

    if (blog) {
      res.json(Blog.format(blog))
    } else {
      res.status(404).end()
    }
  } catch (exception) {
    console.log(exception)
    res.status(400).send({ error: 'malformatted id' })
  }
})


blogsRouter.post('/', async (req, res) => {
  const body = req.body
  console.log(body.title, body.url)

try {
  console.log("This is req.body", req.body)
  console.log("This is req.token:", req.token)
  const token = req.token
  const decodedToken = jwt.verify(token, process.env.SECRET)

  if (!token || !decodedToken.id) {
    return res.status(401).json({ error: 'token missing or invalid' })
  }

  if (body.title.length === 0 || body.url.length === 0) {
    return res.status(400).json({ error: 'title or url missing' })
  }

  const user = await User.findById(decodedToken.id)

    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes === undefined ? 0 : body.likes,
      user: user._id
    })

    const savedBlog = await blog.save()

    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

    res.json(Blog.format(blog))

} catch (exception) {
  if (exception.name === 'JsonWebTokenError') {
    res.status(401).json({ error: exception.message })
  } else {
    console.log(exception)
    res.status(500).json( {error: 'something went horribly wrong'} )
}
}
})

blogsRouter.put('/:id', async (req, res) => {
  try {
    const body = req.body

    const blog = {
      likes: body.likes
    }

    const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, blog, { new: true })
    res.json(Blog.format(updatedBlog))
  } catch (exception) {
    console.log(exception)
    res.status(400).send({ error: 'malformatted id' })
  }
})

blogsRouter.delete('/:id', async (req, res) => {
  try {
    const token = req.token
    const decodedToken = jwt.verify(token, process.env.SECRET)

    if (!token || !decodedToken.id) {
      return res.status(401).json({ error: 'token missing or invalid' })
    }

    const blogToBeDeleted = await Blog.findById(req.params.id)
    const userId = blogToBeDeleted.user === undefined ? undefined : blogToBeDeleted.user

    console.log("User id: ", userId)
    console.log("decodedToken.id: ", decodedToken.id)

    if (userId === undefined || userId == decodedToken.id) {
    console.log('Delete blog', decodedToken.id, req.body)
    await Blog.findByIdAndRemove(req.params.id)
    res.status(204).end()
  } else {
    return res.status(401).json({ error: 'Wrong user id' })
  }

  } catch (exception) {
    if (exception.name === 'JsonWebTokenError') {
      res.status(401).json({ error: exception.message })
    } else {
      console.log(exception)
      res.status(500).json( {error: 'something went horribly wrong'} )
  }
  }
})

module.exports = blogsRouter
