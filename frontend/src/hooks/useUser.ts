import { useState, useEffect, useRef } from 'react';
import { getStoredUser, getUserInitials, type User } from '@/lib/auth';

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const mounted = useRef(false);

  useEffect(() => {
    if (mounted.current) return;
    mounted.current = true;

    const stored = getStoredUser();
    setUser(stored);
    setIsLoading(false);
  }, []);

  const initials = user ? getUserInitials(user.name) : '';

  return { user, initials, isLoading };
}