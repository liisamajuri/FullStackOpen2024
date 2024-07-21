import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BlogAddForm from './BlogAddForm';

describe('<BlogAddForm />', () => {
  test('calls createBlog with the correct details when a new blog is created', async () => {
    const createBlog = vi.fn();
    const user = userEvent.setup();

    render(<BlogAddForm createBlog={createBlog} />);

    // Simulate user input
    const titleInput = screen.getByPlaceholderText('write title here');
    const authorInput = screen.getByPlaceholderText('write author here');
    const urlInput = screen.getByPlaceholderText('write url here');
    const submitButton = screen.getByText('Create');

    await user.type(titleInput, 'Test Title');
    await user.type(authorInput, 'Test Author');
    await user.type(urlInput, 'http://testurl.com');
    await user.click(submitButton);

    // Ensure createBlog is called with correct arguments
    expect(createBlog.mock.calls).toHaveLength(1);
    expect(createBlog.mock.calls[0][0]).toEqual({
      title: 'Test Title',
      author: 'Test Author',
      url: 'http://testurl.com',
    });
    expect(createBlog.mock.calls[0][1]).toBe(
      'A new blog Test Title added by Test Author!',
    );
  });
});
