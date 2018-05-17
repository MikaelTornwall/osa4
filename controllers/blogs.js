const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

const formatBlog = (blog) => {
  return {
    title: blog.title,
    author: blog.author,
    url: blog.url,
    likes: blog.likes
  }
}

blogsRouter.get('/', (req, res) => {
  Blog
  .find({})
  .then(blogs => {
    res.json(blogs.map(formatBlog))
  })
})

blogsRouter.get('/:id', (req, res) => {
  Blog
  .findById(req.params.id)
  .then(blog => {
    if (blog) {
      res.json(formatBlog(blog))
    } else {
      res.status(404).end()
    }
  }).catch(error => {
    console.log(error)
    res.status(400).send({ error: 'malformatted id' })
  })
})

blogsRouter.post('/', (req, res) => {
    const blog = new Blog(req.body)

    blog
    .save()
    .then(result => {
      res.status(201).json(result)
    })
})

module.exports = blogsRouter
