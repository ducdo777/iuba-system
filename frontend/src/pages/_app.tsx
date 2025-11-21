'use client';

import React from 'react';
import { AuthProvider } from '../contexts/AuthContext';
import '../index.css';
import '../App.css';
// Responsive design system
import '../styles/responsive.css';
// Global CSS imports
import '../components/Layout.css';
import '../components/LoginPage.css';
import '../components/admin/AdminDashboard.css';
import '../components/admin/AdminUsers.css';
import '../components/admin/AdminTeams.css';
import '../components/admin/AdminStatistics.css';
import '../components/admin/AdminPoints.css';
import '../components/admin/TableResponsive.css';
import '../components/user/UserDataInput.css';
import '../components/admin/Modal.css';
import '../components/user/Modal.css';

export default function App({ Component, pageProps }: { Component: any; pageProps: any }) {
  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  );
}

