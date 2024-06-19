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

const _ = require('lodash');
const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return null;
  }

  const countedBlogs = _.countBy(blogs, 'author');
  const topBlogger = _.maxBy(_.keys(countedBlogs), author => countedBlogs[author]);

  const bestBlogger = {
    author: topBlogger,
    blogs: countedBlogs[topBlogger]
  };

  return bestBlogger;
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs
}