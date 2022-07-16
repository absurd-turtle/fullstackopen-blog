const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const helper = require('./test_helper')
const jwt = require('jsonwebtoken')


async function loginUser() {
  let response = await api
    .post('/api/login')
    .send({
      username: 'test',
      password: 'test'
    })
  auth.token = response.body.token;
  return auth
}

var auth = {
  token: ''
}

beforeAll(async () => {
  await api
    .post('/api/users')
    .send({
      username: 'test',
      name: 'test',
      password: 'test'
    })
  auth = await loginUser()
})

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

  await api
    .post('/api/blogs')
    .send({
      _id: "5a422bc61b54a676234d23ty",
      title: "Some title",
      author: "Robert C. Martin",
      url: "http://test.com/some/uri",
      likes: 2,
      __v: 0
    })
    .set('Authorization', 'bearer ' + auth.token)
  response = await api.get('/api/blogs')
  expect(response.body.length).toBe(previousLength + 1)
})

test('creates a new blog post without likes option', async () => {
  let response = await api.get('/api/blogs')

  await api
    .post('/api/blogs')
    .send({
      _id: "5a422bc61b54a676234d23ty",
      title: "Some title",
      author: "Robert C. Martin",
      url: "http://test.com/some/uri",
      __v: 0
    })
    .set('Authorization', 'bearer ' + auth.token)

  response = await api.get('/api/blogs')
  let blogs = response.body
  let newBlog = blogs.find(blog => blog.title == "Some title")
  expect(newBlog.likes).toBe(0)
})

test('creating a new blog without url fails', async () => {
  const response = await api
    .post('/api/blogs')
    .send({
      _id: "5a422bc61b54a676234d23ty",
      title: "Some title",
      author: "Robert C. Martin",
      __v: 0
    })
    .set('Authorization', 'bearer ' + auth.token)

  expect(response.status).toBe(400)
})

test('creating a new blog without title fails', async () => {
  const response = await api
    .post('/api/blogs')
    .send({
      _id: "5a422bc61b54a676234d23ty",
      author: "Robert C. Martin",
      url: "http://test.com/some/uri",
      __v: 0
    })
    .set('Authorization', 'bearer ' + auth.token)

  expect(response.status).toBe(400)
})

test('delete a blog post', async () => {
  let response = await api.get('/api/blogs')
  const previousLength = response.body.length

  response = await api
    .post('/api/blogs')
    .send({
      _id: "5a422bc61b54a676234d23ty",
      title: "Some title",
      author: "Robert C. Martin",
      url: "http://test.com/some/uri",
      __v: 0
    })
    .set('Authorization', 'bearer ' + auth.token)

  const blogToDelete = response.body
  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .set('Authorization', 'bearer ' + auth.token)
    .expect(204)

  response = await api.get('/api/blogs')
  expect(response.body.length).toBe(previousLength)
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
    .set('Authorization', 'bearer ' + auth.token)
    .expect(200)

  expect(response.body.likes).toBe(10)
})

describe('when user is not logged in', () => {
  test('creating a new blog post fails', async () => {
    let response = await api
      .post('/api/blogs')
      .send({
        _id: "5a422bc61b54a676234d23ty",
        title: "Some title",
        author: "Robert C. Martin",
        url: "http://test.com/some/uri",
        likes: 2,
        __v: 0
      })
    expect(response.status).toBe(401)
  })
})



afterAll(() => {
  mongoose.connection.close()
})
