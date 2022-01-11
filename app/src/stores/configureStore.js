import {applyMiddleware, createStore} from "redux";
import {createLogger} from "redux-logger";
import {persistStore} from "redux-persist";
import {Alert} from "react-native";
import axios from "axios";
import axiosMiddleware from "redux-axios-middleware";
import reducers from "../reducers";
import setAuthToken, {setAxiosInst} from "../utils/networkUtils";
import {getAuthToken} from "../utils/localStorage";
import {API_URL} from "../utils/config";
import i18n from '../locale/i18n';
import RNExitApp from 'react-native-exit-app';

const isDebuggingInChrome = true;

const client = axios.create({
  baseURL: API_URL,
  responseType: "json",
  headers: {
    "Content-type": "application/json; charset=UTF-8",
  }
}); 

setAxiosInst(client);

const logger = createLogger({
  predicate: (getState, action) => isDebuggingInChrome,
  collapsed: true,
  duration: true
});

async function initAuthHeader() {
  const _token = await getAuthToken();
  if (_token !== null) setAuthToken(_token);
  //console.log(_token);
}

initAuthHeader();

client.interceptors.request.use(request => {
  console.log("Starting Request", request);
  return request;
});

// client.interceptors.response.use(response => {
//   console.log("Response:", response);
//   return response;
// });

client.interceptors.response.use(function(response) {
  console.log("Response", response);
  return response;
}, function(error) {
  // console.log("Error",error.response.status);
  /*if(error.response.status === 401) {
    console.log("Response", error.response);

    setTimeout(() => {
      Alert.alert(
        i18n.t('components.unauthorizedTitle'),
        i18n.t('components.unauthorizedDesc'),
        [
          {
            text: "Ok",
            onPress: () => {
              RNExitApp.exitApp();
            }
          }
        ]
      )
    },1000)
  }*/
  return Promise.reject(error)
})

/*const createAppStore = applyMiddleware(thunk, promise, array, logger)(
  createStore
);*/

// client.onSucess()

async function configureStore(onComplete: () => void) {
  setAxiosInst(client)
  const store = createStore(
    reducers,
    applyMiddleware(axiosMiddleware(client), logger)
  );
  persistStore(store, null, () => onComplete());

  if (isDebuggingInChrome) {
    window.store = store;
  }
  return store;
}

module.exports = configureStore;
