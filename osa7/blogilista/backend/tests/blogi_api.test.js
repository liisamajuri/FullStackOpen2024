const { test, after, beforeEach, describe } = require('node:test');
const Blog = require('../models/blog');
const User = require('../models/user');
const mongoose = require('mongoose');
const supertest = require('supertest');
const helper = require('./test_helper');
const assert = require('assert');

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const app = require('../app');
const api = supertest(app);

let token = '';

beforeEach(async () => {
  await Blog.deleteMany({});
  await User.deleteMany({});

  const passwordHash = await bcrypt.hash('sekret', 10);
  const user = new User({ username: 'root', passwordHash });

  const savedUser = await user.save();

  // Generate token for tests
  const userForToken = {
    username: savedUser.username,
    id: savedUser._id,
  };

  token = jwt.sign(userForToken, process.env.SECRET, { expiresIn: '1h' });

  await Blog.insertMany(helper.initialBlogs);
});

describe('checking the correct format of the data', () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });

  test('returned blogs have an id field', async () => {
    const response = await api.get('/api/blogs');
    const blogs = response.body;

    blogs.forEach((blog) => {
      assert.ok(blog.id);
      assert.strictEqual(blog._id, undefined);
    });
  });
});

describe('addition of a new blog', () => {
  test('succeeds with valid data and token', async () => {
    const newBlog = {
      _id: '5a422b8912345676234d17fa',
      title: 'The Black Cat',
      author: 'Edgar Allan Poe',
      url: 'https://en.wikipedia.org/wiki/Edgar_Allan_Poe',
      likes: 25,
      __v: 0,
    };

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const blogsAtEnd = await helper.blogsInDb();
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1);

    const contents = blogsAtEnd.map((n) => n.title);
    assert(contents.includes('The Black Cat'));
  });

  test('succeeds without likes', async () => {
    const newBlog = {
      _id: 'abcdefg12345676234d17fa',
      title: 'The Raven',
      author: 'Edgar Allan Poe',
      url: 'https://en.wikipedia.org/wiki/Edgar_Allan_Poe',
      __v: 0,
    };

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const blogsAtEnd = await helper.blogsInDb();
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1);

    const addedBlog = blogsAtEnd.find((blog) => blog.title === 'The Raven');
    assert.strictEqual(addedBlog.likes, 0);
  });

  test('fails with status code 400 if title is missing', async () => {
    const newBlog = {
      _id: 'abcdefg12345676opqrstu',
      author: 'Edgar Allan Poe',
      url: 'https://en.wikipedia.org/wiki/Edgar_Allan_Poe',
      __v: 0,
    };

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(400);

    const blogsAtEnd = await helper.blogsInDb();

    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length);
  });

  test('fails with status code 400 if url is missing', async () => {
    const newBlog = {
      _id: 'abcdefg098765432134d17fa',
      title: 'The Raven',
      author: 'Edgar Allan Poe',
      __v: 0,
    };

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(400);

    const blogsAtEnd = await helper.blogsInDb();

    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length);
  });

  test('fails with status code 401 if token is missing', async () => {
    const newBlog = {
      _id: 'abcdefg12345676234d17fa',
      title: 'The Raven',
      author: 'Edgar Allan Poe',
      url: 'https://en.wikipedia.org/wiki/Edgar_Allan_Poe',
      __v: 0,
    };

    await api.post('/api/blogs').send(newBlog).expect(401);

    const blogsAtEnd = await helper.blogsInDb();
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length);
  });
});

describe('deletion of a blog', () => {
  test('succeeds with status code 204 if id is valid and token provided', async () => {
    const newBlog = {
      title: 'Blog to be deleted',
      author: 'Author',
      url: 'http://example.com',
      likes: 10,
    };

    // Add a new blog with token
    const blogToDeleteResponse = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog);

    const blogToDelete = blogToDeleteResponse.body;

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204);

    const blogsAtEnd = await helper.blogsInDb();
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length);

    const contents = blogsAtEnd.map((r) => r.title);
    assert(!contents.includes(blogToDelete.title));
  });

  test('fails with status code 401 if token is missing', async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToDelete = blogsAtStart[0];

    await api.delete(`/api/blogs/${blogToDelete.id}`).expect(401);

    const blogsAtEnd = await helper.blogsInDb();
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length);
  });
});

describe('updating a blog', () => {
  test('succeeds with valid data', async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToUpdate = blogsAtStart[0];
    //console.log(blogToUpdate)

    const updatedBlog = {
      ...blogToUpdate,
      likes: blogToUpdate.likes + 1,
    };

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(updatedBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const blogsAtEnd = await helper.blogsInDb();
    const updatedBlogDb = blogsAtEnd.find(
      (blog) => blog.id === blogToUpdate.id,
    );
    //console.log(updatedBlogDb)

    assert.strictEqual(updatedBlogDb.likes, blogToUpdate.likes + 1);
  });
});

after(async () => {
  await mongoose.connection.close();
});
