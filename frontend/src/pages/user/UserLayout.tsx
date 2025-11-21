import React from 'react';
import { Outlet } from 'react-router-dom';
import { Layout } from '../../components/Layout';

export const UserLayout: React.FC = () => {
  return (
    <Layout role="user">
      <Outlet />
    </Layout>
  );
};
