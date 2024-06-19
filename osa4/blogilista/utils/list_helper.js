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


module.exports = {
  dummy,
  totalLikes
}