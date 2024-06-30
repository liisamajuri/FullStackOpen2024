import Blog from './Blog'
import PropTypes from 'prop-types'

const FilteredBlogs = ({ blogs, user, updateLikes }) => {
  if (!user) {
    return null
  }
  
  const userBlogs = blogs.filter(blog => blog.user.name === user.name)

  return (
    <div>
      <h3>Your Blogs</h3>
      {userBlogs.length > 0 ? (
        userBlogs.map(blog => <Blog key={blog.id} blog={blog} updateLikes={updateLikes} />)
      ) : (
        <div>No blogs found</div>
      )}
    </div>
  )
}

FilteredBlogs.propTypes = {
  blogs: PropTypes.array.isRequired,
  user: PropTypes.object.isRequired,
  updateLikes: PropTypes.func.isRequired,
}

export default FilteredBlogs
