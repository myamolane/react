import request from '../utils/request';

export async function query() {
  return request('/api/users');
}

export async function queryCurrent() {
  return request('/api/accounts/current/', {
    method: 'GET'
  });
}

export async function login(params){
  return request('/api/auth/login/', {
    method: 'POST',
    body: params  
  })
}

export async function getToken(params){
  return request('/api/auth/token/', {
    method: 'POST',
    body: params
  })
}

export async function register(params){
  console.log(params)
  return request('/api/accounts/', {
    method: 'POST',
    body: params
  })
}

export async function requestVerify(params){
  return request('/api/verifies/', {
    method: 'POST',
    body: params
  })
}

export async function resetPassword(params){
  return request('/api/verifies/'+params.code+'/reset_password/', {
    method: 'POST',
    body: params
  })
}

export async function verify(code) {
  return request('/api/verifies/'+code+'/')
}