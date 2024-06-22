const { test, after, beforeEach, describe } = require('node:test')
const Blog = require('../models/blog')
const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const assert = require('assert')

const app = require('../app')
const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
})

describe('checking the correct format of the data', () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('returned blogs have an id field', async () => {
    const response = await api.get('/api/blogs')
    const blogs = response.body

    blogs.forEach(blog => {
      assert.ok(blog.id)
      assert.strictEqual(blog._id, undefined)
    })
  })
})


describe('addition of a new blog', () => {
  test('succeeds with valid data', async () => {
    const newBlog = {
      _id: "5a422b8912345676234d17fa",
      title: "The Black Cat",
      author: "Edgar Allan Poe",
      url: "https://en.wikipedia.org/wiki/Edgar_Allan_Poe",
      likes: 25,
      __v: 0
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

    const contents = blogsAtEnd.map(n => n.title)
    assert(contents.includes('The Black Cat'))
  })
  test('succeeds without likes', async () => {
    const newBlog = {
      _id: "abcdefg12345676234d17fa",
      title: "The Raven",
      author: "Edgar Allan Poe",
      url: "https://en.wikipedia.org/wiki/Edgar_Allan_Poe",
      __v: 0
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()

    const addedBlog = blogsAtEnd.find(blog => blog.title === 'The Raven')
    assert.strictEqual(addedBlog.likes, 0)
  })
})

after(async () => {
  await mongoose.connection.close()
})
