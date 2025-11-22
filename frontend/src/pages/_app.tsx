'use client';

import React, { useEffect } from 'react';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { AuthProvider } from '../contexts/AuthContext';

const theme = extendTheme({
  colors: {
    primary: {
      50: '#eff6ff',
      100: '#dbeafe',
      200: '#bfdbfe',
      300: '#93c5fd',
      400: '#60a5fa',
      500: '#3b82f6',
      600: '#2563eb',
      700: '#1d4ed8',
      800: '#1e40af',
      900: '#1e3a8a',
    },
  },
  config: {
    initialColorMode: 'light',
    useSystemColorMode: false,
  },
});

export default function App({ Component, pageProps }: { Component: any; pageProps: any }) {
  // Preconnect to API domain for faster connections
  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || '/api';
    const link = document.createElement('link');
    link.rel = 'preconnect';
    link.href = apiUrl;
    document.head.appendChild(link);
    
    const dnsLink = document.createElement('link');
    dnsLink.rel = 'dns-prefetch';
    dnsLink.href = apiUrl;
    document.head.appendChild(dnsLink);
  }, []);

  return (
    <ChakraProvider theme={theme}>
      <AuthProvider>
        <Component {...pageProps} />
      </AuthProvider>
    </ChakraProvider>
  );
}

