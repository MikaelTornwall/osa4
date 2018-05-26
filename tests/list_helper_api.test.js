const supertest = require('supertest')
const { app, server } = require('../index')
const api = supertest(app)
const Blog = require('../models/blog')
const User = require('../models/user')
const { initialBlogs, nonExistingId, blogsInDb, usersInDb } = require('./test_helper')

describe('testing GET and POST requests with initial blogs', async () =>{
  beforeAll(async () => {
    jest.setTimeout(10000)
    await Blog.remove()
    console.log('cleared')

    const blogObjects = initialBlogs.map(blog => new Blog(blog))
    await Promise.all(blogObjects.map(blog => blog.save()))
  })

describe('all blogs are returned as json by GET /api/blogs', () => {
test('we are able to return the blog list with GET request', async () => {
  const blogsInDatabase = await blogsInDb()

  const res = await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)

    const returnedTitles = res.body.map(blog => blog.title)
    blogsInDatabase.forEach(blog => {
      expect(returnedTitles).toContain(blog.title)
    })
})

test('individual blogs are returned as json by GET /api/blogs', async () => {
  const blogsInDatabase = await blogsInDb()
  const individualBlog = blogsInDatabase[0]

  const res = await api
  .get(`/api/blogs/${individualBlog.id}`)
  .expect(200)
  .expect("Content-Type", /application\/json/)

  expect(res.body.title).toBe(individualBlog.title)
})

})

describe('testing POST request', () => {
test('a new blog can be added to the list', async () => {
  const blogsInDbBefore = await blogsInDb()

  const newBlog = {
    title: "A new blog title",
    author: "Mikael Törnwall",
    url: "no_url",
    likes: 1,
  }

  await api
  .post('/api/blogs')
  .send(newBlog)
  .expect(200)
  .expect('Content-Type', /application\/json/)

  const blogsInDbAfter = await blogsInDb()

  expect(blogsInDbAfter.length).toBe(blogsInDbBefore.length + 1)

  const titles = blogsInDbAfter.map(blog => blog.title)
  expect(titles).toContain('A new blog title')
})

test('if "likes" is undefined, set value to 0', async () => {
  await Blog.remove()

  const newBlog = {
    title: "Another blog title",
    author: "Mikael Törnwall",
    url: "random_url"
  }

  await api
  .post('/api/blogs')
  .send(newBlog)
  .expect(200)

  const blogsInDatabase = await blogsInDb()
  console.log('Blog title and likes:', blogsInDatabase[0].title, blogsInDatabase[0].likes)

  expect(blogsInDatabase[0].likes).toBe(0)
})

test('if title or url is missing, respond with bad request', async () => {
  const newBlog = {
    author: "Mikael Törnwall"
  }

  const blogsInDbBefore = await blogsInDb()

  await api
  .post('/api/blogs')
  .send(newBlog)
  .expect(400)

  const blogsInDbAfter = await blogsInDb()

console.log('Blogs before', blogsInDbBefore.length)
console.log('Blogs after', blogsInDbAfter.length)

  expect(blogsInDbBefore.length).toBe(blogsInDbAfter.length)
})

})

describe('testing HTTP DELETE request', async () => {
  let postToBeDeleted

  beforeAll(async () => {
    postToBeDeleted = new Blog({
      title: 'This blog post will be deleted',
      author: 'Mikael Törnwall',
      url: 'url_not_found',
      likes: 5
    })
    await postToBeDeleted.save()
  })

  test('a blog can be deleted from the list', async () => {
    const blogsInDbBefore = await blogsInDb()
    console.log(blogsInDbBefore)
    console.log('This is the id:', postToBeDeleted._id)
    await api
    .delete(`/api/blogs/${postToBeDeleted._id}`)
    .expect(204)

    const blogsInDbAfter = await blogsInDb()

    const titles = blogsInDbAfter.map(blog => blog.title)
    expect(titles).not.toContain(postToBeDeleted.title)
    expect(blogsInDbAfter.length).toBe(blogsInDbBefore.length - 1)
})
})

describe('testing HTTP PUT request', async () => {
  beforeAll(async () => {
    postToBeUpdated = new Blog({
      title: 'The number of likes will be updated',
      author: 'Mikael Törnwall',
      url: 'cant_come_up_with_any',
      likes: 0
    })
    await postToBeUpdated.save()
  })
  test('the number of likes can be updated', async () => {
    const blogsInDbBefore = await blogsInDb()

    const blog = {
      likes: 99
    }

    await api
    .put(`/api/blogs/${postToBeUpdated._id}`)
    .send(blog)
    .expect(200)

    const blogsInDbAfter = await blogsInDb()
    const lastElement = blogsInDbAfter.pop()

    expect(lastElement.likes).toBe(blog.likes)
  })
  })

describe('when one user exists in db', async () => {
  beforeAll(async () => {
    await User.remove()
    const user = new User({
      username: 'mike',
      name: 'test',
      password: 'salasana',
      adult: true
    })
    await user.save()
  })

test('a new user can be added and if adult is undefine, adult: true', async () => {
  const usersInDbBefore = await usersInDb()

  const newUser = {
    username: 'Mikael',
    name: 'Mikael Törnwall',
    password: 'salasana',
  }

  await api
  .post('/api/users')
  .send(newUser)
  .expect(200)
  .expect("Content-Type", /application\/json/)

  const usersInDbAfter = await usersInDb()
  expect(usersInDbAfter.length).toBe(usersInDbBefore.length + 1)
  const users = usersInDbAfter.map(user => user.username)
  expect(users).toContain(newUser.username)
  const last = usersInDbAfter.pop()
  expect(last.adult).toBeTruthy()
})

test('if username is already taken, responds with proper statuscode and message', async () => {
  const usersInDbBefore = await usersInDb()

  const newUser = {
    username: 'mike',
    name: 'Supermike',
    password: 'salainen',
    adult: false
  }

  const res = await api
  .post('/api/users')
  .send(newUser)
  .expect(400)
  .expect("Content-Type", /application\/json/)

  const usersInDbAfter = await usersInDb()

  expect(res.body).toEqual({ error: 'username is already taken' })
  expect(usersInDbAfter.length).toBe(usersInDbBefore.length)
})

test('proper response if password less than 3 characters', async () => {
  const usersInDbBefore = await usersInDb()

  const newUser = {
    username: 'TestiMike',
    name: 'Test',
    password: '2S',
  }

  const res = await api
  .post('/api/users')
  .send(newUser)
  .expect(400)
  .expect("Content-Type", /application\/json/)

  const usersInDbAfter = await usersInDb()

  expect(res.body).toEqual({ error: 'password must be at least three characters long' })
  expect(usersInDbAfter.length).toBe(usersInDbBefore.length)
})
})

afterAll(() => {
  server.close()
})

})
