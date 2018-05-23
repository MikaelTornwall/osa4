const supertest = require('supertest')
const { app, server } = require('../index')
const api = supertest(app)
const Blog = require('../models/blog')
const { initialBlogs, format, nonExistingId, blogsInDb } = require('./test_helper')

beforeAll(async () => {
  jest.setTimeout(10000)
  await Blog.remove()
  console.log('cleared')

  let blogObject = new Blog(initialBlogs[0])
  await blogObject.save()

  blogObject = new Blog(initialBlogs[1])
  await blogObject.save()
})

describe('testing GET request for all posts', () => {

test('we are able to return the blog list with GET request', async () => {
  const res = await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', 'application/json; charset=utf-8')
})

test('all blogs are returned', async () => {
  const res = await api
  .get('/api/blogs')

  expect(res.body.length).toBe(initialBlogs.length)
})

test('a specific blog is within the returned blogs', async () => {
  const res = await api
  .get('/api/blogs')

  const contents = res.body.map(r => r.title)

  expect(contents).toContain('React patterns')
})

})

describe('testing POST request', () => {
test('a new blog can be added to the list', async () => {
  const newBlog = {
    title: "Blog title",
    author: "Mikael Törnwall",
    url: "no_url",
    likes: 1,
  }

  await api
  .post('/api/blogs')
  .send(newBlog)
  .expect(200)
  .expect('Content-Type', 'application/json; charset=utf-8')

  const res = await api
  .get('/api/blogs')

  const title = res.body.map(r => r.title)

  expect(res.body.length).toBe(initialBlogs.length + 1)
  expect(title).toContainEqual('Blog title')
})

test('if "likes" is undefined, set value to 0', async () => {
  const newBlog = {
    title: "Another blog title",
    author: "Mikael Törnwall",
    url: "random_url",
  }

  await api
  .post('/api/blogs')
  .send(newBlog)
  .expect(200)

  const res = await api
  .get('/api/blogs')

  const posts = res.body.length
  console.log(posts)
  const last = res.body[posts - 1].likes

  expect(last).toBe(0)
})

test('if title or url is missing, respond with bad request', async () => {
  const newBlog = {
    author: "Mikael Törnwall"
  }

  const initBlogs = await api
  .get('/api/blogs')

  await api
  .post('/api/blogs')
  .send(newBlog)
  .expect(400)

  const res = await api
  .get('/api/blogs')

console.log('the res length is', res.body.length)
console.log('the initBlogs length is', initBlogs.body.length)

  expect(res.body.length).toBe(initBlogs.body.length)
})

})

afterAll(() => {
  server.close()
})
