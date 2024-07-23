import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { likeBlog } from '../reducers/blogReducer';

const BlogView = () => {
  const { id } = useParams();
  const blogs = useSelector((state) => state.blogs);
  const blog = blogs.find((b) => b.id === id);
  const dispatch = useDispatch();

  if (!blog) {
    return <div>Loading...</div>;
  }

  const handleLike = () => {
    const updatedBlog = {
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: blog.likes + 1,
      user: blog.user.id,
    };
    dispatch(likeBlog(id, updatedBlog));
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
