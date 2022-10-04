import { createSlice } from '@reduxjs/toolkit';
import { ResponseInfoState } from '../../interfaces/redux.interfaces';
import { RootState } from '../store';

export const responseDataInitState: ResponseInfoState = {
  body: '',
  headers: [],
  fetching: false,
  status: null,
  statusText: null,
};

const responseDataSlice = createSlice({
  name: 'response-data',
  initialState: responseDataInitState,
  reducers: {
    setBody: (state, { payload }) => {
      state.body = payload.body;
    },
    setHeaders: (state, { payload }) => {
      state.headers = payload.headers;
    },
    setFetching: (state, { payload }) => {
      state.fetching = payload.fetching;
    },
    setStatus: (state, { payload }) => {
      state.status = payload.status;
    },
    setStatusText: (state, { payload }) => {
      state.statusText = payload.statusText;
    },
    clearResponseData: () => ({
      ...responseDataInitState,
    }),
  },
});

export const {
  setBody,
  setHeaders,
  setFetching,
  setStatus,
  setStatusText,
  clearResponseData,
} = responseDataSlice.actions;

export const responseDataSelector = (state: RootState) =>
  state.rootReducer.responseData;

export default responseDataSlice.reducer;
