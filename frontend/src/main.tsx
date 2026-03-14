import React from 'react';
import ReactDOM from 'react-dom/client';
import { ConfigProvider } from 'antd';
import { App } from '@/app/App';
import { ApolloProviderWrapper } from '@/app/providers/ApolloProvider';
import { I18nProvider } from '@/app/providers/I18nProvider';
import '@/styles/global.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#0ea5e9',
        },
      }}
    >
      <I18nProvider>
        <ApolloProviderWrapper>
          <App />
        </ApolloProviderWrapper>
      </I18nProvider>
    </ConfigProvider>
  </React.StrictMode>
);
