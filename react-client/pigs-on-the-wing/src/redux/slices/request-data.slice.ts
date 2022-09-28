import { createSlice } from '@reduxjs/toolkit';
import { RequestMethods } from '../../generated/graphql';
import { RequestInfoState } from '../../interfaces/redux.interfaces';
import { RootState } from '../store';

export const requestDataInitState: RequestInfoState = {
  id: null,
  name: 'New Request',
  description: '',
  method: RequestMethods.Get,
  url: '',
  body: '',
  headers: [],
  loading: false,
};

const requestDataSlice = createSlice({
  name: 'request-data',
  initialState: requestDataInitState,
  reducers: {
    setRequestData: (state, { payload }) => {
      state.id = payload.id;
      state.name = payload.name;
      state.description = payload.description;
      state.method = payload.method;
      state.url = payload.url;
      state.body = payload.body;
      state.headers = payload.headers;
    },
    setName: (state, { payload }) => {
      state.name = payload.name;
    },
    setDescription: (state, { payload }) => {
      state.description = payload.description;
    },
    setMethod: (state, { payload }) => {
      state.method = payload.method;
    },
    setUrl: (state, { payload }) => {
      state.url = payload.url;
    },
    setBody: (state, { payload }) => {
      state.body = payload.body;
    },
    setHeaders: (state, { payload }) => {
      state.headers = payload.headers;
    },
    setLoading: (state, { payload }) => {
      state.loading = payload.loading;
    },
    clearRequestData: (state) => ({
      ...state,
      ...requestDataInitState,
    }),
  },
});

export const {
  setRequestData,
  setName,
  setDescription,
  setMethod,
  setUrl,
  setBody,
  setHeaders,
  setLoading,
  clearRequestData,
} = requestDataSlice.actions;

export const requestDataSelector = (state: RootState) =>
  state.rootReducer.requestData;

export default requestDataSlice.reducer;
