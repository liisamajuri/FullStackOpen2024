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
  await page.getByText(blog.title).waitFor()
}

const likeBlog = async (page, blog) => {
  await page.getByRole('button', { name: 'view' }).click()
  await page.getByRole('button', { name: 'like' }).click()
  await page.getByText(`likes ${blog.likes + 1}`).waitFor()
} 


export { loginWith, createBlog, likeBlog }
