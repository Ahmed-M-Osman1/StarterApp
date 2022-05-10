import {configureStore} from '@reduxjs/toolkit';
import {combineReducers} from 'redux';
import misc from './misc';
import user from './user';

const reducer = combineReducers({
  misc,
  user,
});
const store = configureStore({
  reducer,
});
export default store;
