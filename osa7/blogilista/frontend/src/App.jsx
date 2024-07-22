import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import FilteredBlogs from './components/FilteredBlogs';
import BlogAddForm from './components/BlogAddForm';
import Togglable from './components/Togglable';
import blogService from './services/blogs';
import loginService from './services/login';
import { setNotificationWithTimeout } from './reducers/notificationReducer';
import { initializeBlogs, createBlog } from './reducers/blogReducer';
import Notification from './components/Notification';
import './index.css';

const App = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const blogFormRef = useRef();
  const dispatch = useDispatch();
  const blogs = useSelector((state) => state.blogs);

  useEffect(() => {
    dispatch(initializeBlogs());
  }, [dispatch]);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser');
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const addBlog = async (blogObject, message) => {
    if (!blogObject) {
      dispatch(setNotificationWithTimeout(message, 'error', 3));
      return;
    }

    try {
      await dispatch(createBlog(blogObject));
      dispatch(setNotificationWithTimeout(message, 'info', 3));
      blogFormRef.current.toggleVisibility();
    } catch (exception) {
      dispatch(setNotificationWithTimeout('Error adding blog', 'error', 3));
    }
  };

  const updateLikes = async (id, updatedBlog) => {
    try {
      const returnedBlog = await blogService.update(id, updatedBlog);
      dispatch(setNotificationWithTimeout('Likes updated!', 'info', 3));
      dispatch(initializeBlogs());
    } catch (exception) {
      dispatch(setNotificationWithTimeout('Error updating likes', 'error', 3));
    }
  };

  const deleteBlog = async (id) => {
    try {
      await blogService.remove(id);
      dispatch(setNotificationWithTimeout('Blog deleted', 'info', 3));
      dispatch(initializeBlogs());
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
