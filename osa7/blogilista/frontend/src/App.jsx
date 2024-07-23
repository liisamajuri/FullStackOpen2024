import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  Navigate,
} from 'react-router-dom';
import './index.css';
import FilteredBlogs from './components/FilteredBlogs';
import BlogAddForm from './components/BlogAddForm';
import Togglable from './components/Togglable';
import UserList from './components/UserList';
import User from './components/User';
import Notification from './components/Notification';
import BlogView from './components/BlogView';
import { setNotificationWithTimeout } from './reducers/notificationReducer';
import {
  initializeBlogs,
  createBlog,
  likeBlog,
  deleteBlog,
} from './reducers/blogReducer';
import { loginUser, logoutUser, initializeUser } from './reducers/userReducer';
import { initializeUsers } from './reducers/usersReducer';

const App = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const blogFormRef = useRef();
  const dispatch = useDispatch();
  const blogs = useSelector((state) => state.blogs);
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(initializeBlogs());
    dispatch(initializeUsers());
    dispatch(initializeUser());
  }, [dispatch]);

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

  const updateLikes = (id, updatedBlog) => {
    try {
      dispatch(likeBlog(id, updatedBlog));
      dispatch(setNotificationWithTimeout('Likes updated!', 'info', 3));
    } catch (exception) {
      dispatch(setNotificationWithTimeout('Error updating likes', 'error', 3));
    }
  };

  const handleDeleteBlog = (id) => {
    try {
      dispatch(deleteBlog(id));
      dispatch(setNotificationWithTimeout('Blog deleted', 'info', 3));
    } catch (exception) {
      dispatch(setNotificationWithTimeout('Error deleting blog', 'error', 3));
    }
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    console.log('logging in with', username, password);

    try {
      await dispatch(loginUser({ username, password }));
      setUsername('');
      setPassword('');
      dispatch(setNotificationWithTimeout(`${username} logged in!`, 'info', 3));
    } catch (exception) {
      setUsername('');
      setPassword('');
      dispatch(setNotificationWithTimeout('Wrong credentials', 'error', 3));
    }
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    dispatch(setNotificationWithTimeout(`${user.name} logged out!`, 'info', 3));
    navigate('/');
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
        deleteBlog={handleDeleteBlog}
      />
    </div>
  );

  return (
    <div>
      <h1>Blogs</h1>
      <Notification />
      {user ? (
        <div>
          <p>
            {user.name} ({user.username}) logged in
          </p>
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        loginForm()
      )}

      <Routes>
        <Route path="/" element={user && <div>{blogForm()}</div>} />
        <Route path="/users" element={user && <UserList />} />
        <Route path="/users/:id" element={<User />} />
        <Route path="/blogs/:id" element={<BlogView />} />
      </Routes>
    </div>
  );
};

export default App;
