import React from 'react';
import { Outlet } from 'react-router-dom';
import { Layout } from '../../components/Layout';

export const AdminLayout: React.FC = () => {
  return (
    <Layout role="admin">
      <Outlet />
    </Layout>
  );
};
