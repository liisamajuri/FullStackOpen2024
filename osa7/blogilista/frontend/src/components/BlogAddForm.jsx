import { useState } from 'react';
import PropTypes from 'prop-types';
import { Form, Button } from 'react-bootstrap';

const BlogAddForm = ({ createBlog }) => {
  const [newTitle, setNewTitle] = useState('');
  const [newAuthor, setNewAuthor] = useState('');
  const [newUrl, setNewUrl] = useState('');

  const addBlog = async (event) => {
    event.preventDefault();
    if (!newTitle || !newAuthor || !newUrl) {
      createBlog(null, 'All fields are required!');
      return;
    }

    const blogObject = {
      title: newTitle,
      author: newAuthor,
      url: newUrl,
    };

    createBlog(blogObject, `A new blog ${newTitle} added by ${newAuthor}!`);
    setNewTitle('');
    setNewAuthor('');
    setNewUrl('');
  };

  const handleTitleChange = (event) => {
    setNewTitle(event.target.value);
  };

  const handleAuthorChange = (event) => {
    setNewAuthor(event.target.value);
  };

  const handleUrlChange = (event) => {
    setNewUrl(event.target.value);
  };

  return (
    <div>
      <Form onSubmit={addBlog}>
        <Form.Group controlId="formTitle">
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            value={newTitle}
            onChange={handleTitleChange}
            placeholder="Write title here"
          />
        </Form.Group>
        <Form.Group controlId="formAuthor">
          <Form.Label>Author</Form.Label>
          <Form.Control
            type="text"
            value={newAuthor}
            onChange={handleAuthorChange}
            placeholder="Write author here"
          />
        </Form.Group>
        <Form.Group controlId="formUrl">
          <Form.Label>Url</Form.Label>
          <Form.Control
            type="text"
            value={newUrl}
            onChange={handleUrlChange}
            placeholder="Write url here"
          />
        </Form.Group>
        <br></br>
        <Button variant="primary" type="submit">
          Create
        </Button>
      </Form>
    </div>
  );
};

BlogAddForm.propTypes = {
  createBlog: PropTypes.func.isRequired,
};

export default BlogAddForm;
