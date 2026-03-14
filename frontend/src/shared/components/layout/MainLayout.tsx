import { ReactNode } from 'react';
import { Layout } from 'antd';

const { Content } = Layout;

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Content>{children}</Content>
    </Layout>
  );
}
