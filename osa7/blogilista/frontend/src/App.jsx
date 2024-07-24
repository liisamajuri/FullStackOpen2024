import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  Navigate,
  Link,
} from 'react-router-dom';
import { Form, Button, Navbar, Nav } from 'react-bootstrap';
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
  const [clearFields, setClearFields] = useState(false);
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
      setClearFields(true);
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
    <Form onSubmit={handleLogin}>
      <h2>Log in to application</h2>
      <Form.Group>
        <Form.Label>Username</Form.Label>
        <Form.Control
          data-testid="username"
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </Form.Group>
      <Form.Group>
        <Form.Label>Password</Form.Label>
        <Form.Control
          data-testid="password"
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </Form.Group>
      <Button variant="primary" type="submit" className="mt-3">
        Login
      </Button>
    </Form>
  );

  const blogForm = () => (
    <div>
      <h2>Blogs</h2>
      <Togglable buttonLabel="Create new blog" ref={blogFormRef}>
        <BlogAddForm createBlog={addBlog} clearFields={clearFields} />
      </Togglable>
      <FilteredBlogs
        blogs={blogs}
        user={user}
        updateLikes={updateLikes}
        deleteBlog={handleDeleteBlog}
      />
    </div>
  );

  const padding = {
    paddingRight: 5,
  };

  const Navigation = () => {
    return (
      <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Link href="#" as="span">
              <Link style={padding} to="/">
                blogs
              </Link>
            </Nav.Link>
            <Nav.Link href="#" as="span">
              <Link style={padding} to="/users">
                users
              </Link>
            </Nav.Link>
            <Nav.Link href="#" as="span">
              {user ? (
                <>
                  <em>{user.name} logged in </em>
                  <button onClick={handleLogout}>logout</button>
                </>
              ) : (
                <Link style={padding} to="/login">
                  login
                </Link>
              )}
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    );
  };

  return (
    <div className="container">
      <Notification />
      <Navigation />
      <br></br>
      <h1>Blog App</h1>
      <br></br>
      <Routes>
        <Route
          path="/"
          element={
            user ? <div>{blogForm()}</div> : <Navigate replace to="/login" />
          }
        />
        <Route
          path="/users"
          element={user ? <UserList /> : <Navigate replace to="/login" />}
        />
        <Route
          path="/users/:id"
          element={user ? <User /> : <Navigate replace to="/login" />}
        />
        <Route
          path="/blogs/:id"
          element={user ? <BlogView /> : <Navigate replace to="/login" />}
        />
        <Route
          path="/login"
          element={!user ? loginForm() : <Navigate replace to="/" />}
        />
      </Routes>
    </div>
  );
};

export default App;
