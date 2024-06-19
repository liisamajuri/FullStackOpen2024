const dummy = (blogs) => {
  return 1;
}

const totalLikes = (blogs) => {
  const totalSum = blogs.reduce(
    (sum, item) => sum + item.likes, 0,
  );
  return blogs.length === 0
    ? 0 
    : totalSum
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return null;
  }

  const maxBlog = blogs.reduce(
    (max, blog) => (blog.likes > max.likes ? blog : max), blogs[0]
  );

  const bestBlog = {
    title: maxBlog.title,
    author: maxBlog.author,
    likes: maxBlog.likes
  };

  return bestBlog;
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
}