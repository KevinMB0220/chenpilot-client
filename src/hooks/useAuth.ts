import { useEffect, useState } from 'react';
import { useAppSelector } from '@/store';

export const useAuth = () => {
  const { isAuthenticated, user, token, isLoading } = useAppSelector((state) => state.auth);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return {
    isAuthenticated: isClient ? isAuthenticated : false,
    user: isClient ? user : null,
    token: isClient ? token : null,
    isLoading: isClient ? isLoading : false,
    isClient,
  };
};


