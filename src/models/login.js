import { routerRedux } from 'dva/router';
import { fakeAccountLogin } from '../services/api';
import { login, getToken } from '../services/user'
import { unAuthorized, setAuthority, saveToken } from '../utils/authority';
import { reloadAuthorized } from '../utils/Authorized';
import { App } from '../app'
export default {
  namespace: 'login',

  state: {
    status: undefined,
  },

  effects: {
    *login({ payload }, { call, put }) {
      //const response = yield call(login, payload);
      const response = yield call(login, payload);
      yield put({
        type: 'changeLoginStatus',
        payload: response,
      });
      // Login successfully
      yield put({
        type: 'setToken',
        payload: response.data
      })
      if (response.status==='ok') {
        reloadAuthorized();
        yield put(routerRedux.push('/'));
      }
      else if (response.status ==='forbidden'){
        yield put(routerRedux.push('/user/verify/register'));
      }
    },
    *logout(_, { put, select }) {
      try {
        // get location pathname
        const urlParams = new URL(window.location.href);
        const pathname = yield select(state => state.routing.location.pathname);
        // add the parameters in the url
        urlParams.searchParams.set('redirect', pathname);
        window.history.replaceState(null, 'login', urlParams.href);
      } finally {
        yield put({
          type: 'changeLoginStatus',
          payload: {
            status: false,
            currentAuthority: 'guest',
          },
        });
        reloadAuthorized();
        yield put(routerRedux.push('/user/login'));
      }
    },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      if (payload.status==='ok')
        setAuthority(payload.data.is_admin);
      else
        unAuthorized();
      return {
        ...state,
        status: payload.status,
        type: payload.type,
      };
    },
    setToken(state, { payload }){
      if (payload && payload.token != undefined){
        let token = 'JWT ' + payload.token
        saveToken(token)
      }
      return {
        ...state,
        //token: payload.token
      }
    }
  },
};
