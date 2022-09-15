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
  helloWorld: Scalars['String'];
  me?: Maybe<User>;
  userCollections: Array<Collection>;
};


export type QueryCollectionByIdArgs = {
  collectionId: Scalars['String'];
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
};

export type RequestDataInput = {
  body?: InputMaybe<Scalars['String']>;
  description?: InputMaybe<Scalars['String']>;
  headers?: InputMaybe<Array<HeaderInput>>;
  method: RequestMethods;
  name: Scalars['String'];
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

export type RegisterMutationVariables = Exact<{
  username: Scalars['String'];
  password: Scalars['String'];
}>;


export type RegisterMutation = { __typename?: 'Mutation', register: { __typename?: 'UserResponse', errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null, user?: { __typename?: 'User', id: string, username: string, password: string } | null } };


export const RegisterDocument = gql`
    mutation Register($username: String!, $password: String!) {
  register(options: {username: $username, password: $password}) {
    errors {
      field
      message
    }
    user {
      id
      username
      password
    }
  }
}
    `;

export function useRegisterMutation() {
  return Urql.useMutation<RegisterMutation, RegisterMutationVariables>(RegisterDocument);
};