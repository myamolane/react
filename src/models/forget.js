import {requestVerify, resetPassword, verify} from '../services/user'
import { routerRedux } from 'dva/router';
import { message } from 'antd';
import { reloadAuthorized } from '../utils/Authorized';

export default {
    namespace: 'forget',

    state: {
        status: 'waiting',
        title: '正在验证...',
        description: '请稍候，正在等待服务器响应',
    },

    effects: {
        *request( {payload}, {call, put}) {
            console.log(payload)
            const response = yield call(requestVerify, payload);
            message.success('已发送找回密码链接到您的邮箱，24小时之内有效，请注意查收!');
            yield put(routerRedux.push('/user/login'));
        },
        *reset( {payload}, {call, put}) {
            const response = yield call(resetPassword, payload);
            yield put({
                type: 'login/changeLoginStatus',
                payload: response,
            });
            yield put({
                type: 'login/setToken',
                payload: response.data
            })
            if (response.status === 'ok') {
                reloadAuthorized();
                yield put(routerRedux.push('/'));
            }
        },
        *verifyEmail( {payload}, {call, put} ){
            const response = yield call(verify, payload);
            if (response.status === 'ok'){
                yield put({
                    type: 'changeVerifyStatus',
                    payload: {
                        status: 'success',
                        title: '验证成功',
                        description: '您的账号已成功验证，点击返回首页即可登录。'
                    }
                })
            }
            else{
                yield put({
                    type: 'changeVerifyStatus',
                    payload: {
                        status: 'error',
                        title: '验证失败',
                        description: response.message
                    }
                })
            }
            
        }
    },

    reducers: {
        changeVerifyStatus(state, {payload}) {
            console.log('reducer')
            return {
                ...state,
                ...payload,
            }
        }
    }
}