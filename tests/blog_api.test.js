const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const helper = require('./test_helper')


beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
})


describe("when there is initially some blogs saved", () => {
  test('blog posts are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })
  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')

    expect(response.body).toHaveLength(helper.initialBlogs.length)
  })

})

test('unique identifier property is named id', async () => {
  const response = await api.get('/api/blogs')
  expect(response.body[0].id).toBeDefined()
})

test('creates a new blog post', async () => {
  let response = await api.get('/api/blogs')
  const previousLength = response.body.length

  await api.post('/api/blogs', {
    _id: "5a422bc61b54a676234d23ty",
    title: "Some title",
    author: "Robert C. Martin",
    url: "http://test.com/some/uri",
    likes: 2,
    __v: 0
  })

  response = await api.get('/api/blogs')
  expect(response.body.length).toBe(previousLength + 1)
})

test('delete a blog post', async () => {
  let response = await api.get('/api/blogs')
  const previousLength = response.body.length

  const blogToDelete = helper.initialBlogs[0]

  await api
    .delete(`/api/blogs/${blogToDelete._id}`)
    .expect(204)

  response = await api.get('/api/blogs')
  expect(response.body.length).toBe(previousLength - 1)
  const titles = response.body.map(b => b.title)
  expect(titles).not.toContain(blogToDelete)
})

test('update a blog post', async () => {
  let blogToUpdate = {
    title: helper.initialBlogs[0].title,
    author: helper.initialBlogs[0].author,
    url: helper.initialBlogs[0].url,
    likes: 10
  }

  const response = await api
    .put(`/api/blogs/${helper.initialBlogs[0]._id}`)
    .send(blogToUpdate)
    .expect(200)

  expect(response.body.likes).toBe(10)
})



afterAll(() => {
  mongoose.connection.close()
})
