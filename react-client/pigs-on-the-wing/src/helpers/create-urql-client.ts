import { dedupExchange, fetchExchange } from 'urql';
import { cacheExchange } from '@urql/exchange-graphcache';
import {
  LoginMutation,
  MeQuery,
  MeDocument,
  RegisterMutation,
  LogoutMutation,
  CreateCollectionMutation,
  UserCollectionsQuery,
  useUserCollectionsQuery,
  UserCollectionsDocument,
} from '../generated/graphql';
import { betterUpdateQuery } from './better-update-query';
import { errorExchange } from './error-exchange';

export const createUrqlClient = (ssrExchange: any) => ({
  url: 'http://localhost:8081/graphql',
  fetchOptions: {
    credentials: 'include' as const,
  },
  exchanges: [
    dedupExchange,
    cacheExchange({
      updates: {
        Mutation: {
          login: (_result, _args, cache, _info) => {
            betterUpdateQuery<LoginMutation, MeQuery>(
              cache,
              { query: MeDocument },
              _result,
              (result, query) => {
                if (result.login.errors) {
                  return query;
                } else {
                  return {
                    me: result.login.user,
                  };
                }
              },
            );
          },
          register: (_result, _args, cache, _info) => {
            betterUpdateQuery<RegisterMutation, MeQuery>(
              cache,
              { query: MeDocument },
              _result,
              (result, query) => {
                if (result.register.errors) {
                  return query;
                } else {
                  return {
                    me: result.register.user,
                  };
                }
              },
            );
          },
          logout: (_result, _args, cache, _info) => {
            betterUpdateQuery<LogoutMutation, MeQuery>(
              cache,
              { query: MeDocument },
              _result,
              () => ({ me: null }),
            );
          },
          // createCollection: (_result, _args, cache, _info) => {
          //   betterUpdateQuery<CreateCollectionMutation, UserCollectionsQuery>(
          //     cache,
          //     { query: UserCollectionsDocument },
          //     _result,
          //     (result, query) => {
          //       if (result.createCollection.errors) {
          //         return query;
          //       } else {
          //         return
          //         }
          //       }
          //     },
          //   );
          // },
        },
      },
    }),
    ssrExchange,
    // errorExchange,
    fetchExchange,
  ],
});
