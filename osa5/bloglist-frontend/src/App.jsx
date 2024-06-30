import { useState, useEffect, useRef } from 'react'
import FilteredBlogs from './components/FilteredBlogs'
import BlogAddForm from './components/BlogAddForm'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [infoMessage, setInfoMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const blogFormRef = useRef()

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

  const addBlog = async (blogObject) => {
    
    try {
      const returnedBlog = await blogService.create(blogObject)
      setBlogs(blogs.concat(returnedBlog))
      fetchBlogs()
    } catch (exception) {
      throw new Error('Error adding blog')
    }
    blogFormRef.current.toggleVisibility()
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
      <Togglable buttonLabel='Create new blog' ref={blogFormRef}>
        <BlogAddForm createBlog={addBlog} />
      </Togglable>
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
