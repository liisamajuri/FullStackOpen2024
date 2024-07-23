import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { likeBlog } from '../reducers/blogReducer';
import { setNotificationWithTimeout } from '../reducers/notificationReducer';

const BlogView = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const blog = useSelector((state) =>
    state.blogs.find((blog) => blog.id === id),
  );

  if (!blog) {
    return <div>Loading...</div>;
  }

  const handleLike = () => {
    dispatch(likeBlog(blog.id, { ...blog, likes: blog.likes + 1 }));
    dispatch(setNotificationWithTimeout('Blog liked!', 'info', 3));
  };

  return (
    <div>
      <h2>
        {blog.title} {blog.author}
      </h2>
      <a href={blog.url}>{blog.url}</a>
      <div>
        {blog.likes} likes <button onClick={handleLike}>like</button>
      </div>
      <div>added by {blog.user.name}</div>
    </div>
  );
};

export default BlogView;
