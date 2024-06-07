import { useEffect } from 'react';
import { logout } from '@/lib/auth';

const Logout = () => {
  useEffect(() => {
    logout();
  }, []);

  return <div>Logging out...</div>;
};

export default Logout;
