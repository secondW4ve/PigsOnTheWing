import { combineReducers } from '@reduxjs/toolkit';
import requestDataReducer from './request-data.slice';
import responseDataReducer from './response-data.slice';

const rootReducer = combineReducers({
  requestData: requestDataReducer,
  responseData: responseDataReducer,
});

export default rootReducer;
