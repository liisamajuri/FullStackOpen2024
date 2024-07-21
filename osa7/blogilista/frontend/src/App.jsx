import { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import FilteredBlogs from './components/FilteredBlogs';
import BlogAddForm from './components/BlogAddForm';
import Togglable from './components/Togglable';
import blogService from './services/blogs';
import loginService from './services/login';
import { setNotificationWithTimeout } from './reducers/notificationReducer';
import Notification from './components/Notification';
import './index.css';

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const blogFormRef = useRef();
  const dispatch = useDispatch();

  const fetchBlogs = async () => {
    const blogs = await blogService.getAll();
    blogs.sort((a, b) => b.likes - a.likes);
    setBlogs(blogs);
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser');
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  if (!blogs) {
    return null;
  }

  console.log('render', blogs.length, 'blogs');

  const addBlog = async (blogObject, message) => {
    if (!blogObject) {
      dispatch(setNotificationWithTimeout(message, 'error', 3));
      return;
    }

    try {
      const returnedBlog = await blogService.create(blogObject);
      setBlogs(blogs.concat(returnedBlog));
      dispatch(setNotificationWithTimeout(message, 'info', 3));
      fetchBlogs();
      blogFormRef.current.toggleVisibility();
    } catch (exception) {
      dispatch(setNotificationWithTimeout('Error adding blog', 'error', 3));
    }
  };

  const updateLikes = async (id, updatedBlog) => {
    try {
      const returnedBlog = await blogService.update(id, updatedBlog);
      const updatedBlogs = blogs.map((blog) =>
        blog.id === id ? returnedBlog : blog,
      );
      updatedBlogs.sort((a, b) => b.likes - a.likes);
      setBlogs(updatedBlogs);
    } catch (exception) {
      dispatch(setNotificationWithTimeout('Error updating likes', 'error', 3));
    }
  };

  const deleteBlog = async (id) => {
    try {
      await blogService.remove(id);
      setBlogs(blogs.filter((blog) => blog.id !== id));
    } catch (exception) {
      dispatch(setNotificationWithTimeout('Error deleting blog', 'error', 3));
    }
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    console.log('logging in with', username, password);

    try {
      const user = await loginService.login({
        username,
        password,
      });

      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user));

      blogService.setToken(user.token);
      setUser(user);
      setUsername('');
      setPassword('');
      dispatch(
        setNotificationWithTimeout(`${user.name} logged in!`, 'info', 3),
      );
    } catch (exception) {
      setUsername('');
      setPassword('');
      dispatch(setNotificationWithTimeout('Wrong credentials', 'error', 3));
    }
  };

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser');
    setUser(null);
    dispatch(setNotificationWithTimeout(`${user.name} logged out!`, 'info', 3));
  };

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <h2>Log in to application</h2>
      <div>
        Username:
        <input
          data-testid="username"
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        Password:
        <input
          data-testid="password"
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">Login</button>
    </form>
  );

  const blogForm = () => (
    <div>
      <Togglable buttonLabel="Create new blog" ref={blogFormRef}>
        <BlogAddForm createBlog={addBlog} />
      </Togglable>
      <FilteredBlogs
        blogs={blogs}
        user={user}
        updateLikes={updateLikes}
        deleteBlog={deleteBlog}
      />
    </div>
  );

  return (
    <div>
      <h1>Blogs</h1>
      <Notification />

      {!user && loginForm()}
      {user && (
        <div>
          <p>
            {user.name} ({user.username}) logged in
          </p>
          <button onClick={handleLogout}>Logout</button>
          {blogForm()}
        </div>
      )}
    </div>
  );
};

export default App;
