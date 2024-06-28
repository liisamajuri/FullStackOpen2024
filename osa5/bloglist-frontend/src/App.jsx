import { useState, useEffect } from 'react'
import FilteredBlogs from './components/FilteredBlogs'
import BlogAddForm from './components/BlogAddForm'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')
  const [infoMessage, setInfoMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  const fetchBlogs = async () => {
    const blogs = await blogService.getAll()
    setBlogs(blogs)
  }

  useEffect(() => {
    fetchBlogs()
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  if (!blogs) {
    return null
  }

  console.log('render', blogs.length, 'blogs')

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

  const addBlog = async (event) => {
    event.preventDefault()
    if (!newTitle || !newAuthor || !newUrl) {
      console.log('Something is missing')
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
      const returnedBlog = await blogService.create(blogObject)
      setBlogs(blogs.concat(returnedBlog))
      setInfoMessage(`A new blog ${newTitle} added from ${newAuthor}!`)
      setNewTitle('')
      setNewAuthor('')
      setNewUrl('')
      fetchBlogs()            
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

  const handleLogin = async (event) => {
    event.preventDefault()
    console.log('logging in with', username, password)

    try {
      const user = await loginService.login({
        username, password,
      })

      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )

      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      setInfoMessage(`${user.name} logged in!`)
      setTimeout(() => {
        setInfoMessage(null)
      }, 5000)
    } catch (exception) {
      setUsername('')
      setPassword('')
      setErrorMessage('Wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
    setInfoMessage(`${user.name} logged out!`)
    setTimeout(() => {
      setInfoMessage(null)
    }, 5000)
  }

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <h2>Log in to application</h2>
      <div>
        Username: 
        <input
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        Password: 
        <input
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">Login</button>
    </form>
  )

  const blogForm = () => (
    <div>
      <h3>Create a new blog:</h3>
      <BlogAddForm
        addBlog={addBlog}
        newTitle={newTitle}
        handleTitleChange={handleTitleChange}
        newAuthor={newAuthor}
        handleAuthorChange={handleAuthorChange}
        newUrl={newUrl}
        handleUrlChange={handleUrlChange}
      />
      <FilteredBlogs blogs={blogs} user={user} />
    </div>
  )

  return (
    <div>
      <h1>Blogs</h1>
      <Notification message={infoMessage} type="info" />
      <Notification message={errorMessage} type="error" />

      {!user && loginForm()}
      {user && <div>
        <p>{user.name} ({user.username}) logged in</p>
        <button onClick={handleLogout}>Logout</button>
        {blogForm()}
      </div>
      }
    </div>
  )
}

export default App
