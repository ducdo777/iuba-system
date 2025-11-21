'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';

export default function Home() {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated && user) {
      router.replace(user.role === 'admin' ? '/admin' : '/user');
    } else {
      router.replace('/login');
    }
  }, [isAuthenticated, user, router]);

  return null;
}

