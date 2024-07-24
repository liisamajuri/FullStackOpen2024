import { createSlice } from '@reduxjs/toolkit';
import blogService from '../services/blogs';
import { setNotificationWithTimeout } from './notificationReducer';

const blogSlice = createSlice({
  name: 'blogs',
  initialState: [],
  reducers: {
    setBlogs(state, action) {
      return action.payload;
    },
    appendBlog(state, action) {
      state.push(action.payload);
    },
    updateBlog(state, action) {
      const updatedBlog = action.payload;
      return state.map((blog) =>
        blog.id !== updatedBlog.id ? blog : updatedBlog,
      );
    },
    removeBlog(state, action) {
      return state.filter((blog) => blog.id !== action.payload);
    },
    appendComment(state, action) {
      const { id, comment } = action.payload;
      const blog = state.find((blog) => blog.id === id);
      if (blog) {
        blog.comments = blog.comments.concat(comment);
      }
    },
  },
});

export const { setBlogs, appendBlog, updateBlog, removeBlog, appendComment } =
  blogSlice.actions;

export const initializeBlogs = () => {
  return async (dispatch) => {
    const blogs = await blogService.getAll();
    blogs.sort((a, b) => b.likes - a.likes);
    dispatch(setBlogs(blogs));
  };
};

export const createBlog = (blogObject) => {
  return async (dispatch) => {
    const newBlog = await blogService.create(blogObject);
    dispatch(appendBlog(newBlog));
    dispatch(initializeBlogs());
  };
};

export const likeBlog = (id, updatedBlog) => {
  return async (dispatch) => {
    try {
      const returnedBlog = await blogService.update(id, updatedBlog);
      dispatch(updateBlog(returnedBlog));
      dispatch(setNotificationWithTimeout('Blog liked!', 'info', 3));
    } catch (error) {
      console.error('Error updating blog:', error);
      dispatch(setNotificationWithTimeout('Error updating blog', 'error', 3));
    }
  };
};

export const deleteBlog = (id) => {
  return async (dispatch) => {
    await blogService.remove(id);
    dispatch(removeBlog(id));
    dispatch(initializeBlogs());
  };
};

export const addComment = (id, comment) => {
  return async (dispatch) => {
    const updatedBlog = await blogService.addComment(id, comment);
    dispatch(updateBlog(updatedBlog));
    dispatch(appendComment({ id, comment }));
    dispatch(initializeBlogs());
  };
};

export default blogSlice.reducer;
