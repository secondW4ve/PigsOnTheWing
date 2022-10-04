import gql from 'graphql-tag';
import * as Urql from 'urql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Collection = {
  __typename?: 'Collection';
  description: Scalars['String'];
  id: Scalars['String'];
  name: Scalars['String'];
  owner: User;
  requests: Array<RequestData>;
  users: Array<User>;
};

export type CollectionDeleteResponse = {
  __typename?: 'CollectionDeleteResponse';
  deleted?: Maybe<Scalars['Boolean']>;
  errors?: Maybe<Array<FieldError>>;
};

export type CollectionInput = {
  description?: InputMaybe<Scalars['String']>;
  name: Scalars['String'];
};

export type CollectionResponse = {
  __typename?: 'CollectionResponse';
  collection?: Maybe<Collection>;
  errors?: Maybe<Array<FieldError>>;
};

export type FieldError = {
  __typename?: 'FieldError';
  field: Scalars['String'];
  message: Scalars['String'];
};

export type Header = {
  __typename?: 'Header';
  id: Scalars['String'];
  name: Scalars['String'];
  request: RequestData;
  value: Scalars['String'];
};

export type HeaderInput = {
  name: Scalars['String'];
  value: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  addUserToCollection: CollectionResponse;
  createCollection: CollectionResponse;
  createRequestInCollection: RequestDataResponse;
  deleteCollection?: Maybe<CollectionDeleteResponse>;
  deleteRequest: RequestDataResponse;
  login: UserResponse;
  logout: Scalars['Boolean'];
  register: UserResponse;
  removeUserFromCollection: CollectionResponse;
  updateCollection: CollectionResponse;
  updateHeaders: RequestDataResponse;
  updateRequest: RequestDataResponse;
};


export type MutationAddUserToCollectionArgs = {
  collectionId: Scalars['String'];
  username: Scalars['String'];
};


export type MutationCreateCollectionArgs = {
  collectionData: CollectionInput;
};


export type MutationCreateRequestInCollectionArgs = {
  collectionId: Scalars['String'];
  requestData: RequestDataInput;
};


export type MutationDeleteCollectionArgs = {
  collectionId: Scalars['String'];
};


export type MutationDeleteRequestArgs = {
  requestId: Scalars['String'];
};


export type MutationLoginArgs = {
  options: UsernamePasswordInput;
};


export type MutationRegisterArgs = {
  options: UsernamePasswordInput;
};


export type MutationRemoveUserFromCollectionArgs = {
  collectionId: Scalars['String'];
  username: Scalars['String'];
};


export type MutationUpdateCollectionArgs = {
  collectionData: CollectionInput;
  collectionId: Scalars['String'];
};


export type MutationUpdateHeadersArgs = {
  headers: Array<HeaderInput>;
  requestId: Scalars['String'];
};


export type MutationUpdateRequestArgs = {
  requestData: RequestDataInput;
  requestId: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  collectionById: CollectionResponse;
  me?: Maybe<User>;
  requestById: RequestDataResponse;
  userCollections: Array<Collection>;
};


export type QueryCollectionByIdArgs = {
  collectionId: Scalars['String'];
};


export type QueryRequestByIdArgs = {
  requestId: Scalars['String'];
};

export type RequestData = {
  __typename?: 'RequestData';
  body?: Maybe<Scalars['String']>;
  collection?: Maybe<Collection>;
  description: Scalars['String'];
  headers?: Maybe<Array<Header>>;
  id: Scalars['String'];
  method: RequestMethods;
  name: Scalars['String'];
  url: Scalars['String'];
};

export type RequestDataInput = {
  body?: InputMaybe<Scalars['String']>;
  description?: InputMaybe<Scalars['String']>;
  headers: Array<HeaderInput>;
  method: RequestMethods;
  name: Scalars['String'];
  url: Scalars['String'];
};

export type RequestDataResponse = {
  __typename?: 'RequestDataResponse';
  errors?: Maybe<Array<FieldError>>;
  request?: Maybe<RequestData>;
};

export enum RequestMethods {
  Delete = 'DELETE',
  Get = 'GET',
  Post = 'POST',
  Put = 'PUT'
}

export type User = {
  __typename?: 'User';
  id: Scalars['String'];
  password: Scalars['String'];
  username: Scalars['String'];
};

export type UserResponse = {
  __typename?: 'UserResponse';
  errors?: Maybe<Array<FieldError>>;
  user?: Maybe<User>;
};

export type UsernamePasswordInput = {
  password: Scalars['String'];
  username: Scalars['String'];
};

export type ErrorInfoFragment = { __typename?: 'FieldError', field: string, message: string };

export type UserInfoFragment = { __typename?: 'User', id: string, username: string };

export type AddUserToCollectionMutationVariables = Exact<{
  username: Scalars['String'];
  collectionId: Scalars['String'];
}>;


export type AddUserToCollectionMutation = { __typename?: 'Mutation', addUserToCollection: { __typename?: 'CollectionResponse', errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null, collection?: { __typename?: 'Collection', id: string, name: string } | null } };

export type CreateCollectionMutationVariables = Exact<{
  collectionData: CollectionInput;
}>;


export type CreateCollectionMutation = { __typename?: 'Mutation', createCollection: { __typename?: 'CollectionResponse', errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null, collection?: { __typename?: 'Collection', id: string, name: string } | null } };

export type CreateRequestInCollectionMutationVariables = Exact<{
  inputData: RequestDataInput;
  collectionId: Scalars['String'];
}>;


export type CreateRequestInCollectionMutation = { __typename?: 'Mutation', createRequestInCollection: { __typename?: 'RequestDataResponse', errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null, request?: { __typename?: 'RequestData', id: string, name: string } | null } };

export type DeleteCollectionMutationVariables = Exact<{
  collectionId: Scalars['String'];
}>;


export type DeleteCollectionMutation = { __typename?: 'Mutation', deleteCollection?: { __typename?: 'CollectionDeleteResponse', deleted?: boolean | null, errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null } | null };

export type DeleteRequestMutationVariables = Exact<{
  requestId: Scalars['String'];
}>;


export type DeleteRequestMutation = { __typename?: 'Mutation', deleteRequest: { __typename?: 'RequestDataResponse', errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null, request?: { __typename?: 'RequestData', id: string } | null } };

export type LoginMutationVariables = Exact<{
  username: Scalars['String'];
  password: Scalars['String'];
}>;


export type LoginMutation = { __typename?: 'Mutation', login: { __typename?: 'UserResponse', errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null, user?: { __typename?: 'User', id: string, username: string } | null } };

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = { __typename?: 'Mutation', logout: boolean };

export type RegisterMutationVariables = Exact<{
  username: Scalars['String'];
  password: Scalars['String'];
}>;


export type RegisterMutation = { __typename?: 'Mutation', register: { __typename?: 'UserResponse', errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null, user?: { __typename?: 'User', id: string, username: string } | null } };

export type RemoveUserFromCollectionMutationVariables = Exact<{
  username: Scalars['String'];
  collectionId: Scalars['String'];
}>;


export type RemoveUserFromCollectionMutation = { __typename?: 'Mutation', removeUserFromCollection: { __typename?: 'CollectionResponse', errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null, collection?: { __typename?: 'Collection', id: string, name: string } | null } };

export type UpdateRequestMutationVariables = Exact<{
  requestId: Scalars['String'];
  requestData: RequestDataInput;
}>;


export type UpdateRequestMutation = { __typename?: 'Mutation', updateRequest: { __typename?: 'RequestDataResponse', errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null, request?: { __typename?: 'RequestData', id: string, name: string, description: string, method: RequestMethods, url: string, body?: string | null, headers?: Array<{ __typename?: 'Header', name: string, value: string }> | null } | null } };

export type CollectionRequestsQueryVariables = Exact<{
  collectionId: Scalars['String'];
}>;


export type CollectionRequestsQuery = { __typename?: 'Query', collectionById: { __typename?: 'CollectionResponse', errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null, collection?: { __typename?: 'Collection', id: string, requests: Array<{ __typename?: 'RequestData', id: string, method: RequestMethods, name: string }> } | null } };

export type CollectionUsersQueryVariables = Exact<{
  collectionId: Scalars['String'];
}>;


export type CollectionUsersQuery = { __typename?: 'Query', collectionById: { __typename?: 'CollectionResponse', errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null, collection?: { __typename?: 'Collection', id: string, users: Array<{ __typename?: 'User', id: string, username: string }> } | null } };

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { __typename?: 'Query', me?: { __typename?: 'User', id: string, username: string } | null };

export type RequestByIdQueryVariables = Exact<{
  requestId: Scalars['String'];
}>;


export type RequestByIdQuery = { __typename?: 'Query', requestById: { __typename?: 'RequestDataResponse', errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null, request?: { __typename?: 'RequestData', id: string, name: string, description: string, method: RequestMethods, url: string, body?: string | null, headers?: Array<{ __typename?: 'Header', name: string, value: string }> | null } | null } };

export type UserCollectionsQueryVariables = Exact<{ [key: string]: never; }>;


export type UserCollectionsQuery = { __typename?: 'Query', userCollections: Array<{ __typename?: 'Collection', id: string, name: string }> };

export const ErrorInfoFragmentDoc = gql`
    fragment ErrorInfo on FieldError {
  field
  message
}
    `;
export const UserInfoFragmentDoc = gql`
    fragment UserInfo on User {
  id
  username
}
    `;
export const AddUserToCollectionDocument = gql`
    mutation AddUserToCollection($username: String!, $collectionId: String!) {
  addUserToCollection(username: $username, collectionId: $collectionId) {
    errors {
      ...ErrorInfo
    }
    collection {
      id
      name
    }
  }
}
    ${ErrorInfoFragmentDoc}`;

export function useAddUserToCollectionMutation() {
  return Urql.useMutation<AddUserToCollectionMutation, AddUserToCollectionMutationVariables>(AddUserToCollectionDocument);
};
export const CreateCollectionDocument = gql`
    mutation CreateCollection($collectionData: CollectionInput!) {
  createCollection(collectionData: $collectionData) {
    errors {
      ...ErrorInfo
    }
    collection {
      id
      name
    }
  }
}
    ${ErrorInfoFragmentDoc}`;

export function useCreateCollectionMutation() {
  return Urql.useMutation<CreateCollectionMutation, CreateCollectionMutationVariables>(CreateCollectionDocument);
};
export const CreateRequestInCollectionDocument = gql`
    mutation CreateRequestInCollection($inputData: RequestDataInput!, $collectionId: String!) {
  createRequestInCollection(requestData: $inputData, collectionId: $collectionId) {
    errors {
      ...ErrorInfo
    }
    request {
      id
      name
    }
  }
}
    ${ErrorInfoFragmentDoc}`;

export function useCreateRequestInCollectionMutation() {
  return Urql.useMutation<CreateRequestInCollectionMutation, CreateRequestInCollectionMutationVariables>(CreateRequestInCollectionDocument);
};
export const DeleteCollectionDocument = gql`
    mutation DeleteCollection($collectionId: String!) {
  deleteCollection(collectionId: $collectionId) {
    errors {
      ...ErrorInfo
    }
    deleted
  }
}
    ${ErrorInfoFragmentDoc}`;

export function useDeleteCollectionMutation() {
  return Urql.useMutation<DeleteCollectionMutation, DeleteCollectionMutationVariables>(DeleteCollectionDocument);
};
export const DeleteRequestDocument = gql`
    mutation DeleteRequest($requestId: String!) {
  deleteRequest(requestId: $requestId) {
    errors {
      ...ErrorInfo
    }
    request {
      id
    }
  }
}
    ${ErrorInfoFragmentDoc}`;

export function useDeleteRequestMutation() {
  return Urql.useMutation<DeleteRequestMutation, DeleteRequestMutationVariables>(DeleteRequestDocument);
};
export const LoginDocument = gql`
    mutation Login($username: String!, $password: String!) {
  login(options: {username: $username, password: $password}) {
    errors {
      ...ErrorInfo
    }
    user {
      ...UserInfo
    }
  }
}
    ${ErrorInfoFragmentDoc}
${UserInfoFragmentDoc}`;

export function useLoginMutation() {
  return Urql.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument);
};
export const LogoutDocument = gql`
    mutation Logout {
  logout
}
    `;

export function useLogoutMutation() {
  return Urql.useMutation<LogoutMutation, LogoutMutationVariables>(LogoutDocument);
};
export const RegisterDocument = gql`
    mutation Register($username: String!, $password: String!) {
  register(options: {username: $username, password: $password}) {
    errors {
      ...ErrorInfo
    }
    user {
      ...UserInfo
    }
  }
}
    ${ErrorInfoFragmentDoc}
${UserInfoFragmentDoc}`;

export function useRegisterMutation() {
  return Urql.useMutation<RegisterMutation, RegisterMutationVariables>(RegisterDocument);
};
export const RemoveUserFromCollectionDocument = gql`
    mutation RemoveUserFromCollection($username: String!, $collectionId: String!) {
  removeUserFromCollection(username: $username, collectionId: $collectionId) {
    errors {
      ...ErrorInfo
    }
    collection {
      id
      name
    }
  }
}
    ${ErrorInfoFragmentDoc}`;

export function useRemoveUserFromCollectionMutation() {
  return Urql.useMutation<RemoveUserFromCollectionMutation, RemoveUserFromCollectionMutationVariables>(RemoveUserFromCollectionDocument);
};
export const UpdateRequestDocument = gql`
    mutation UpdateRequest($requestId: String!, $requestData: RequestDataInput!) {
  updateRequest(requestId: $requestId, requestData: $requestData) {
    errors {
      ...ErrorInfo
    }
    request {
      id
      name
      description
      method
      url
      body
      headers {
        name
        value
      }
    }
  }
}
    ${ErrorInfoFragmentDoc}`;

export function useUpdateRequestMutation() {
  return Urql.useMutation<UpdateRequestMutation, UpdateRequestMutationVariables>(UpdateRequestDocument);
};
export const CollectionRequestsDocument = gql`
    query CollectionRequests($collectionId: String!) {
  collectionById(collectionId: $collectionId) {
    errors {
      ...ErrorInfo
    }
    collection {
      id
      requests {
        id
        method
        name
      }
    }
  }
}
    ${ErrorInfoFragmentDoc}`;

export function useCollectionRequestsQuery(options: Omit<Urql.UseQueryArgs<CollectionRequestsQueryVariables>, 'query'>) {
  return Urql.useQuery<CollectionRequestsQuery, CollectionRequestsQueryVariables>({ query: CollectionRequestsDocument, ...options });
};
export const CollectionUsersDocument = gql`
    query CollectionUsers($collectionId: String!) {
  collectionById(collectionId: $collectionId) {
    errors {
      ...ErrorInfo
    }
    collection {
      id
      users {
        ...UserInfo
      }
    }
  }
}
    ${ErrorInfoFragmentDoc}
${UserInfoFragmentDoc}`;

export function useCollectionUsersQuery(options: Omit<Urql.UseQueryArgs<CollectionUsersQueryVariables>, 'query'>) {
  return Urql.useQuery<CollectionUsersQuery, CollectionUsersQueryVariables>({ query: CollectionUsersDocument, ...options });
};
export const MeDocument = gql`
    query Me {
  me {
    ...UserInfo
  }
}
    ${UserInfoFragmentDoc}`;

export function useMeQuery(options?: Omit<Urql.UseQueryArgs<MeQueryVariables>, 'query'>) {
  return Urql.useQuery<MeQuery, MeQueryVariables>({ query: MeDocument, ...options });
};
export const RequestByIdDocument = gql`
    query RequestById($requestId: String!) {
  requestById(requestId: $requestId) {
    errors {
      ...ErrorInfo
    }
    request {
      id
      name
      description
      method
      url
      body
      headers {
        name
        value
      }
    }
  }
}
    ${ErrorInfoFragmentDoc}`;

export function useRequestByIdQuery(options: Omit<Urql.UseQueryArgs<RequestByIdQueryVariables>, 'query'>) {
  return Urql.useQuery<RequestByIdQuery, RequestByIdQueryVariables>({ query: RequestByIdDocument, ...options });
};
export const UserCollectionsDocument = gql`
    query UserCollections {
  userCollections {
    id
    name
  }
}
    `;

export function useUserCollectionsQuery(options?: Omit<Urql.UseQueryArgs<UserCollectionsQueryVariables>, 'query'>) {
  return Urql.useQuery<UserCollectionsQuery, UserCollectionsQueryVariables>({ query: UserCollectionsDocument, ...options });
};