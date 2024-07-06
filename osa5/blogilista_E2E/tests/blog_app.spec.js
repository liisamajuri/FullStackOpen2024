const { test, describe, expect, beforeEach } = require('@playwright/test')
const { loginWith, createBlog, likeBlog } = require('./helper')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset')
    await request.post('/api/users', {
      data: {
        name: 'Matti Luukkainen',
        username: 'mluukkai',
        password: 'salainen'
      }
    })

    await page.goto('/')
  })

  test('Login form is shown', async ({ page }) => {
    await expect(page.getByText('Log in to application')).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'mluukkai', 'salainen')
      await expect(page.getByText('Matti Luukkainen (mluukkai) logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'mluukkai', 'wrong')
      const errorDiv = await page.locator('.error')
      await expect(errorDiv).toContainText('Wrong credentials')

      await expect(page.getByText('Matti Luukkainen (mluukkai) logged in')).not.toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'mluukkai', 'salainen')
    })
  
    test('a new blog can be created', async ({ page }) => {
      const testblog = {
        title: 'Test Title',
        author: 'Test Author',
        url: 'http://testurl.com'
      }
      await createBlog(page, testblog, true)
      await expect(page.getByText('No blogs found')).not.toBeVisible()
      await expect(page.getByText('Test Title Test Authorview')).toBeVisible()
    })
  
    test('a blog can be liked', async ({ page }) => {
      const testblog = {
        title: 'Test Title',
        author: 'Test Author',
        url: 'http://testurl.com',
        likes: 0
      }
      await createBlog(page, testblog, true)
      await likeBlog(page, testblog, true)
      await expect(page.getByText('view')).not.toBeVisible()
      await expect(page.getByText('hide')).toBeVisible()
      await expect(page.getByText('likes 1')).toBeVisible()
    })

  })


})