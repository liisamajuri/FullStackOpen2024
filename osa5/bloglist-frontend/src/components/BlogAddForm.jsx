const BlogAddForm = ({ addBlog, newTitle, handleTitleChange, newAuthor, handleAuthorChange, newUrl, handleUrlChange }) => {
  return (
    <form onSubmit={addBlog}>
      
      <div>
        Title: <input 
          value={newTitle}
          onChange={handleTitleChange}
        />
      </div>
      <div>
        Author: <input 
          value={newAuthor}
          onChange={handleAuthorChange}
        />
      </div>
      <div>
        Url: <input 
          value={newUrl}
          onChange={handleUrlChange}
        />
      </div>
      <div>
        <br></br>
        <button type="submit">Create</button>
      </div>
    </form>
  );
};

export default BlogAddForm;