import { useSelector } from 'react-redux';
import Alert from 'react-bootstrap/Alert';

const Notification = () => {
  const notification = useSelector((state) => state.notification);

  if (!notification.message) {
    return null;
  }

  return (
    <Alert variant={notification.type === 'error' ? 'danger' : 'success'}>
      {notification.message}
    </Alert>
  );
};

export default Notification;
