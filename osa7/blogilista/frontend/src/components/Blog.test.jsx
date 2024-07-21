import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Blog from './Blog';

describe('Blog component', () => {
  test('renders title and author, but not url or likes by default', () => {
    const blog = {
      title: 'testTitle',
      author: 'testAuthor',
      url: 'testUrl',
      likes: 5,
      user: { username: 'testUser', name: 'Test User' },
    };

    const user = { username: 'testUser' };

    render(
      <Blog
        blog={blog}
        user={user}
        updateLikes={() => {}}
        deleteBlog={() => {}}
      />,
    );

    // Ensure title and author are rendered
    const titleElement = screen.getByText(
      (content, element) =>
        element.tagName.toLowerCase() === 'div' &&
        content.includes('testTitle'),
    );
    const authorElement = screen.getByText(
      (content, element) =>
        element.tagName.toLowerCase() === 'div' &&
        content.includes('testAuthor'),
    );
    expect(titleElement).toBeDefined();
    expect(authorElement).toBeDefined();

    // Ensure url and likes are not rendered by default
    const urlElement = screen.queryByText('testUrl');
    const likesElement = screen.queryByText('likes 5');
    expect(urlElement).toBeNull();
    expect(likesElement).toBeNull();
  });

  test('renders url, likes, and user name when the view button is clicked', async () => {
    const blog = {
      title: 'testTitle',
      author: 'testAuthor',
      url: 'testUrl',
      likes: 5,
      user: { username: 'testUser', name: 'Test User' },
    };

    const user = { username: 'testUser' };

    render(
      <Blog
        blog={blog}
        user={user}
        updateLikes={() => {}}
        deleteBlog={() => {}}
      />,
    );

    const userEventInstance = userEvent.setup();

    // Initially, url and likes are not visible
    let urlElement = screen.queryByText('testUrl');
    let likesElement = screen.queryByText('likes 5');
    expect(urlElement).toBeNull();
    expect(likesElement).toBeNull();

    // Click the view button
    const viewButton = screen.getByText('view');
    await userEventInstance.click(viewButton);

    // Ensure url, likes, and user name are visible after clicking view
    urlElement = screen.getByText('testUrl');
    likesElement = screen.getByText('likes 5');
    const userNameElement = screen.getByText('Test User');
    expect(urlElement).toBeDefined();
    expect(likesElement).toBeDefined();
    expect(userNameElement).toBeDefined();
  });

  test('calls the like handler twice when the like button is clicked twice', async () => {
    const blog = {
      title: 'testTitle',
      author: 'testAuthor',
      url: 'testUrl',
      likes: 5,
      user: { username: 'testUser', name: 'Test User' },
    };

    const user = { username: 'testUser' };
    const mockUpdateLikes = vi.fn();

    render(
      <Blog
        blog={blog}
        user={user}
        updateLikes={mockUpdateLikes}
        deleteBlog={() => {}}
      />,
    );

    const userEventInstance = userEvent.setup();

    // Click the view button to show the like button
    const viewButton = screen.getByText('view');
    await userEventInstance.click(viewButton);

    // Click the like button twice
    const likeButton = screen.getByText('like');
    await userEventInstance.click(likeButton);
    await userEventInstance.click(likeButton);

    // Ensure the like handler is called twice
    expect(mockUpdateLikes).toHaveBeenCalledTimes(2);
  });
});
