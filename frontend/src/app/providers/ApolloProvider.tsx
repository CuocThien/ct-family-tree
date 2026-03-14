import * as Apollo from '@apollo/client';
import { ReactNode } from 'react';
import { apolloClient } from '@/graphql/client';

interface ApolloProviderWrapperProps {
  children: ReactNode;
}

export function ApolloProviderWrapper({ children }: ApolloProviderWrapperProps) {
  return <Apollo.ApolloProvider client={apolloClient}>{children}</Apollo.ApolloProvider>;
}
