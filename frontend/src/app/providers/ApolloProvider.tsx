import { ApolloProvider as BaseApolloProvider } from '@apollo/client';
import { ReactNode } from 'react';
import { apolloClient } from '@/graphql/client';

interface ApolloProviderWrapperProps {
  children: ReactNode;
}

export function ApolloProviderWrapper({ children }: ApolloProviderWrapperProps) {
  return <BaseApolloProvider client={apolloClient}>{children}</BaseApolloProvider>;
}
