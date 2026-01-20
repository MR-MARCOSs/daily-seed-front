import { useEffect, useState } from 'react';

export function useAuthCheck() {
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      setIsChecking(false);
    };

    checkAuth();
  }, []);

  return { isChecking };
}