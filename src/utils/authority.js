// use localStorage to store the authority info, which might be sent from server in actual project.
import {App} from '../app'
export function getAuthority() {
  return localStorage.getItem('antd-pro-authority') || 'admin';
}

export function unAuthorized(){
  localStorage.setItem('antd-pro-authority', 'guest')
  localStorage.removeItem('token')
  App.token = null
}

export function setAuthority(is_admin, token=undefined) {
  let authority =  is_admin ? 'admin' : 'user';
  return localStorage.setItem('antd-pro-authority', authority);
}

export function saveToken(token){
  App.token = token;
  return localStorage.setItem('token', token)
}

export function getToken(){
  if (!App.token)
    App.token = localStorage.getItem('token')
  return App.token
}