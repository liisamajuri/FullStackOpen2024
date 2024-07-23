import Blog from './Blog';
import { Link } from 'react-router-dom';

const FilteredBlogs = ({ blogs, user, updateLikes, deleteBlog }) => {
  if (!user) {
    return null;
  }

  const userBlogs = blogs.filter((blog) => blog.user.name === user.name);

  return (
    <div>
      <h3>Your Blogs</h3>
      {userBlogs.length > 0 ? (
        userBlogs.map((blog) => (
          <div key={blog.id} className="blog">
            <Link to={`/blogs/${blog.id}`}>
              {blog.title} {blog.author}
            </Link>
          </div>
        ))
      ) : (
        <div>No blogs found</div>
      )}
    </div>
  );
};

export default FilteredBlogs;
