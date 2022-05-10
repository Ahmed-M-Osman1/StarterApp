import {createSlice} from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import config from 'react-native-ultimate-config';

const slice = createSlice({
  name: 'user',
  initialState: {
    authed: null,
    access_token: null,
    is_account_admin: null,
    subdomain: config.X_TENANT,
    data: null,
    notificCount: 0,
    fcmToken: '',
    notification: {},
    navigatorReady: false,
    deviceToken: ''
  },
  reducers: {
    saveUser: (state, action) => {
      state.authed = true;
      state.subdomain = action.payload.subdomain;
      state.access_token = action.payload.access_token;
      state.data = action.payload.data;
    },
    saveNotificCount: (state, action) => {
      state.notificCount = action.payload;
    },
    setAuthed: (state, action) => {
      state.authed = action.payload;
    },
    setNotification: (state, action) => {
      state.notification = action.payload;
    },
    setDeviceToken: (state, action) => {
      state.deviceToken = action.payload,
      state.notification = null
    },
    setToken: (state, action) => {
      state.access_token = action.payload.token;
      state.is_account_admin = action.payload.is_account_admin
    },
    setIsNavigatorReady: (state, action) => {
      state.navigatorReady = action.payload;
    },
    setCurrSubDomain: (state, action) => {
      state.subdomain = action.payload;
    },
    logOutUser: (state, action) => {
      state.authed = false;
      //state.subdomain = null;
      state.access_token = null;
      state.data = null;
      state.deviceToken = null;
      state.fcmToken = null;
      state.notification = null;
      state.navigatorReady = false
    },
    setFCMToken: (state, action) => {
      state.fcmToken = action.payload;
    },
  },
});

export default slice.reducer;

export const {
  saveUser,
  saveNotificCount,
  setCurrSubDomain,
  setToken,
  setIsNavigatorReady,
  setAuthed,
  setNotification,
  logOutUser,
  setFCMToken,
  setDeviceToken
} = slice.actions;

export const saveUserData = user => async dispatch => {
  try {
    await AsyncStorage.setItem('user', JSON.stringify(user));
    dispatch(saveUser(user));
  } catch (error) {
    console.log(error);
  }
};

export const getCurrUser = () => async dispatch => {
  try {
    const user = await AsyncStorage.getItem('user');
    if (user) dispatch(saveUser(JSON.parse(user)));
    else dispatch(setAuthed(false));
  } catch (error) {
    dispatch(setAuthed(false));
    console.log(error);
  }
};

export const logOut = () => async dispatch => {
  try {
    await AsyncStorage.removeItem('user').then(() => {
      dispatch(logOutUser());
    });
    dispatch(saveNotificCount(0));
  } catch (error) {
    console.log(error);
    dispatch(setAuthed(false));
  }
};
