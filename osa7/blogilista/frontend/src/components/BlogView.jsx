import { useSelector, useDispatch } from 'react-redux';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { likeBlog, addComment } from '../reducers/blogReducer';
import { setNotificationWithTimeout } from '../reducers/notificationReducer';
import { Button, Form, ListGroup } from 'react-bootstrap';

const BlogView = () => {
  const { id } = useParams();
  const blogs = useSelector((state) => state.blogs);
  const blog = blogs.find((b) => b.id === id);
  const [comment, setComment] = useState('');
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

  const handleCommentChange = (event) => {
    setComment(event.target.value);
  };

  const handleAddComment = (event) => {
    event.preventDefault();
    dispatch(addComment(blog.id, comment));
    dispatch(setNotificationWithTimeout('Comment added!', 'info', 3));
    setComment('');
  };

  return (
    <div>
      <h2>
        {blog.title} {blog.author}
      </h2>
      <a href={blog.url}>{blog.url}</a>
      <div>
        {blog.likes} likes{' '}
        <Button onClick={handleLike} variant="primary" className="ml-2">
          Like
        </Button>
      </div>
      <div>added by {blog.user.name}</div>
      <br />
      <h3>Comments:</h3>
      <Form onSubmit={handleAddComment}>
        <Form.Group controlId="commentForm">
          <Form.Label>Comment</Form.Label>
          <Form.Control
            type="text"
            value={comment}
            onChange={handleCommentChange}
            placeholder="Write a comment"
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Add comment
        </Button>
      </Form>
      <ListGroup className="mt-3">
        {blog.comments.map((comment, index) => (
          <ListGroup.Item key={index}>{comment}</ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  );
};

export default BlogView;
