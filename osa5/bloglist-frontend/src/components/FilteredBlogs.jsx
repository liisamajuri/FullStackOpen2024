import Blog from './Blog'

const FilteredBlogs = ({ blogs, user }) => {
  if (!user) {
    return null
  }
  
  const userBlogs = blogs.filter(blog => blog.user.name === user.name)

  return (
    <div>
      <h3>Your Blogs</h3>
      {userBlogs.length > 0 ? (
        userBlogs.map(blog => <Blog key={blog.id} blog={blog} />)
      ) : (
        <div>No blogs found</div>
      )}
    </div>
  )
}

export default FilteredBlogs