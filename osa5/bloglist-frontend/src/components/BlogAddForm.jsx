import { useState } from 'react'
import PropTypes from 'prop-types'

const BlogAddForm = ({ createBlog }) => {
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')

  const addBlog = async (event) => {
    event.preventDefault()
    if (!newTitle || !newAuthor || !newUrl) {
      createBlog(null, 'All fields are required!')
      return
    }

    const blogObject = {
      title: newTitle,
      author: newAuthor,
      url: newUrl
    }

    createBlog(blogObject, `A new blog ${newTitle} added by ${newAuthor}!`)
    setNewTitle('')
    setNewAuthor('')
    setNewUrl('')
  }

  const handleTitleChange = (event) => {
    setNewTitle(event.target.value)
  }

  const handleAuthorChange = (event) => {
    setNewAuthor(event.target.value)
  }

  const handleUrlChange = (event) => {
    setNewUrl(event.target.value)
  }

  return (
    <div>
      <form onSubmit={addBlog}>
        <div>
          Title: <input
            value={newTitle}
            onChange={handleTitleChange}
            placeholder='write title here'
          />
        </div>
        <div>
          Author: <input
            value={newAuthor}
            onChange={handleAuthorChange}
            placeholder='write author here'
          />
        </div>
        <div>
          Url: <input
            value={newUrl}
            onChange={handleUrlChange}
            placeholder='write url here'
          />
        </div>
        <div>
          <br></br>
          <button type="submit">Create</button>
        </div>
      </form>
    </div>
  )
}

BlogAddForm.propTypes = {
  createBlog: PropTypes.func.isRequired
}

export default BlogAddForm
