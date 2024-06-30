import { useState } from 'react'
import PropTypes from 'prop-types'

const BlogAddForm = ({ createBlog }) => {
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')
  const [infoMessage, setInfoMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  const addBlog = async (event) => {
    event.preventDefault()
    if (!newTitle || !newAuthor || !newUrl) {
      setErrorMessage('All fields are required!')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
      return
    }

    const blogObject = {
      title: newTitle,
      author: newAuthor,
      url: newUrl
    }

    try {
      await createBlog(blogObject)
      setInfoMessage(`A new blog ${newTitle} added by ${newAuthor}!`)
      setNewTitle('')
      setNewAuthor('')
      setNewUrl('')
      setTimeout(() => {
        setInfoMessage(null)
      }, 5000)
    } catch (exception) {
      setErrorMessage('Error adding blog')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
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

  const Notification = ({ message, type }) => {
    if (message === null) {
      return null
    }
  
    return (
      <div className={type === 'error' ? 'error' : 'info'}>
        {message}
      </div>
    )
  }

  return (
    <div>
      <Notification message={infoMessage} type="info" />
      <Notification message={errorMessage} type="error" />
      <form onSubmit={addBlog}>
        <div>
          Title: <input 
            value={newTitle}
            onChange={handleTitleChange}
          />
        </div>
        <div>
          Author: <input 
            value={newAuthor}
            onChange={handleAuthorChange}
          />
        </div>
        <div>
          Url: <input 
            value={newUrl}
            onChange={handleUrlChange}
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
