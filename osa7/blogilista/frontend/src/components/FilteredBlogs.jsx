import Blog from './Blog';
import { Link } from 'react-router-dom';
import Table from 'react-bootstrap/Table';

const FilteredBlogs = ({ blogs, user, updateLikes, deleteBlog }) => {
  if (!user) {
    return null;
  }

  const userBlogs = blogs.filter((blog) => blog.user.name === user.name);

  return (
    <div>
      <br />
      <h3>Your Blogs</h3>
      {userBlogs.length > 0 ? (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Title</th>
              <th>Author</th>
            </tr>
          </thead>
          <tbody>
            {userBlogs.map((blog) => (
              <tr key={blog.id}>
                <td>
                  <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
                </td>
                <td>{blog.author}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <div>No blogs found</div>
      )}
    </div>
  );
};

export default FilteredBlogs;
