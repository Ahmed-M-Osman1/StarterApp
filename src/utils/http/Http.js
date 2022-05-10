import axios, {AxiosError, AxiosResponse} from 'axios';
import config from 'react-native-ultimate-config';
import {mapValidationErrors} from './MapValidationErrors';
import {AlertHelper} from '../AlertHelper';
import store from '../../redux/store';
import i18next from 'i18next';

export const http = axios.create({
  baseURL: config.BASE_URL,
  withCredentials: true,
});

http.interceptors.request.use(
  config => {
    const token = store.getState().user.access_token;
    const subdomain = store.getState().user.subdomain;
    const currentLanguage = i18next.language;

    if (subdomain) {
      config.headers['X-Tenant'] = subdomain;
    }
    if (token) {
      config.headers['Authorization'] = `Bearer ${
        store.getState().user.access_token
      }`;
    }
    if (currentLanguage) {
      config.headers['X-App-Locale'] = currentLanguage;
    }
    // config.headers['Content-Type'] = 'application/json';
    return config;
  },
  error => {
    Promise.reject(error);
  },
);

export const mngmtHttp = axios.create({
  baseURL: `${config.BASE_URL}/api-management`,
  withCredentials: true,
});

export const tenancyHttp = axios.create({
  baseURL: `${config.BASE_URL}/api/tenancy-management`,
  withCredentials: true,
});

mngmtHttp.interceptors.request.use(
  config => {
    const token = store.getState().user.access_token;
    const subdomain = store.getState().user.subdomain;
    const currentLanguage = i18next.language;
    if (subdomain) {
      config.headers['X-Tenant'] = subdomain;
    }
    if (token) {
      config.headers['Authorization'] = `Bearer ${
        store.getState().user.access_token
      }`;
    }
    if (currentLanguage) {
      config.headers['X-App-Locale'] = currentLanguage;
    }
    // config.headers['Content-Type'] = 'application/json';
    return config;
  },
  error => {
    Promise.reject(error);
  },
);

tenancyHttp.interceptors.request.use(
  config => {
    const token = store.getState().user.access_token;
    const subdomain = store.getState().user.subdomain;
    const currentLanguage = i18next.language;
    if (subdomain) {
      config.headers['X-Tenant'] = subdomain;
    }
    if (token) {
      config.headers['Authorization'] = `Bearer ${
        store.getState().user.access_token
      }`;
    }
    if (currentLanguage) {
      config.headers['X-App-Locale'] = currentLanguage;
    }
    // config.headers['Content-Type'] = 'application/json';
    return config;
  },
  error => {
    Promise.reject(error);
  },
);

export const isAxiosError = error => {
  return axios.isAxiosError(error);
};

export const handleError = (error, options) => {
  const serverResponse = error.response;

  if (serverResponse) {
    handleErrorResponse(serverResponse, options);
  } else if (error.request) {
    handleErrorRequest(error.request);
  } else {
    handleErrorRequest(error.request);
  }
};

export const handleErrorRequest = request => {
  AlertHelper.show('error', 'error', 'Please check your internet connectivity');
};

export const handleErrorResponse = (response, options) => {
  const status = response.status;
  switch (status) {
    case 422:
      handleUnprocessableEntity(response.data.errors, status, options);
      break;
    case 500:
      console.log('errrororor');
    case 501:
    case 502:
    case 503:
    case 504:
      handleServerError(status, options);
      break;

    default:
      handleServerError(status, options);
      break;
  }
};

export const handleUnprocessableEntity = (errors, status, options) => {
  AlertHelper.show('error', 'error', 'Some data are incorrect');

  if (options.setError) {
    const setError = options.setError;
    mapValidationErrors(errors).forEach(({name, message, type}) => {
      setError(name, {type, message});
    });
  }
};

const handleServerError = (status, options) => {
  if (shouldToast(status, options.toast)) {
    AlertHelper.show(
      'error',
      'error',
      'The service is unavailable now. Please try again later',
    );
  }
};

const shouldToast = (status, toastOptions) => {
  if (toastOptions === undefined || toastOptions === true) {
    return true;
  }

  if (toastOptions === false) {
    return false;
  }

  if (toastOptions[status] === undefined || toastOptions[status] === true) {
    return true;
  }

  return false;
};
