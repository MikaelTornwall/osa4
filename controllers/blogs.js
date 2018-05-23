const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

const formatBlog = (blog) => {
  return {
    title: blog.title,
    author: blog.author,
    url: blog.url,
    likes: blog.likes === undefined ? 0 : blog.likes
  }
}

blogsRouter.get('/', async (req, res) => {
  const blogs = await Blog.find({})
  res.json(blogs.map(formatBlog))
})

blogsRouter.get('/:id', async (req, res) => {
  try {
    const blog  = await Blog.findById(req.params.id)

    if (blog) {
      res.json(formatBlog(blog))
    } else {
      res.status(404).end()
    }
  } catch (exception) {
    console.log(exception)
    res.status(400).send({ error: 'malformatted id' })
  }
})

blogsRouter.post('/', async (req, res) => {
try { const body = req.body

if (body.title === undefined || body.url === undefined) {
  return res.status(400).json({ error: 'content missing' })
}

    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes === undefined ? 0 : body.likes
    })

    const savedBlog = await blog.save()
    res.json(formatBlog(savedBlog))
} catch (exception) {
    console.log(exception)
    res.status(500).json( {error: 'something went horribly wrong'} )
}
})

module.exports = blogsRouter
