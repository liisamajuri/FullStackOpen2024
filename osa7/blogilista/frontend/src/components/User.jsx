import React from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

const User = () => {
  const { id } = useParams();
  const users = useSelector((state) => state.users);
  const user = users.find((user) => user.id === id);
  console.log(id);
  console.log(users);
  console.log(user);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>{user.name}</h2>
      <br></br>
      <h3>added blogs:</h3>
      <ul>
        {user.blogs.map((blog) => (
          <li key={blog.id}>{blog.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default User;
