const { expect } = require('@playwright/test');

const loginWith = async (page, username, password)  => {
  await page.getByTestId('username').fill(username)
  await page.getByTestId('password').fill(password)
  await page.getByRole('button', { name: 'Login' }).click()
}

const createBlog = async (page, blog) => {
  await page.getByRole('button', { name: 'Create new blog' }).click()
  await page.locator('[placeholder="write title here"]').fill(blog.title)
  await page.locator('[placeholder="write author here"]').fill(blog.author)
  await page.locator('[placeholder="write url here"]').fill(blog.url)

  await page.getByRole('button', { name: 'Create' }).click()

  const notification = page.getByText(`A new blog ${blog.title} added by ${blog.author}!`)
  await expect(notification).toBeVisible()
  await notification.waitFor({ state: 'hidden', timeout: 10000 })

  const blogEntry = page.getByText(`${blog.title} ${blog.author}`);
  await expect(blogEntry).toBeVisible();
}

const likeBlog = async (page, blogTitle) => {
  const blog = page.locator(`text=${blogTitle}`).locator('..') 
  await blog.locator('button', { hasText: 'view' }).click()
  await blog.locator('button', { hasText: 'like' }).click()
} 

const deleteBlog = async (page, blog) => {
  await page.getByRole('button', { name: 'view' }).click();
  page.once('dialog', dialog => {
    console.log('Dialog appeared, accepting it');
    dialog.accept();
  });
  console.log('Clicking remove button');
  await page.getByRole('button', { name: 'remove' }).click();
  console.log('Waiting for confirmation dialog to disappear');
  await page.getByText(`Remove blog ${blog.title} by ${blog.author}`).waitFor({ state: 'hidden', timeout: 10000 });
  console.log('Waiting for blog to disappear from the list');
  await page.getByText(`${blog.title} ${blog.author}hide`).waitFor({ state: 'hidden', timeout: 10000 });
};

const checkDeleteButtonVisible = async (page) => {
  await page.getByRole('button', { name: 'view' }).click();
  await expect(page.getByRole('button', { name: 'remove' })).toBeVisible();
};


export { loginWith, createBlog, likeBlog, deleteBlog, checkDeleteButtonVisible };
