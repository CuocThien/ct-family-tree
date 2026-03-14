import React from 'react';
import ReactDOM from 'react-dom/client';
import { ConfigProvider } from 'antd';
import { App } from '@/app/App';
import { ApolloProviderWrapper } from '@/app/providers/ApolloProvider';
import { I18nProvider } from '@/app/providers/I18nProvider';
import { JotaiProvider } from '@/app/providers/JotaiProvider';
import '@/styles/global.css';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Failed to find the root element');
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#0ea5e9',
        },
      }}
    >
      <JotaiProvider>
        <I18nProvider>
          <ApolloProviderWrapper>
            <App />
          </ApolloProviderWrapper>
        </I18nProvider>
      </JotaiProvider>
    </ConfigProvider>
  </React.StrictMode>
);
