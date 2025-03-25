import request from '@/utils/request'

export const sendAuthCode = account => {
  return request.post('/api/login/sendAuthCode', {
    account
  })
}

export const judgeAuthCode = (account, authCode) => {
  return request.post('/api/login/judgeAuthCode', {
    account,
    authCode
  })
}

export const codeLogin = (account, authCode) => {
  return request.post('/api/login/codeLogin', {
    account,
    authCode
  })
}

export const passwordLogin = (account, password) => {
  return request.post('/api/login/passwordLogin', {
    account,
    password
  })
}

export const logout = account => {
  return request.post('/api/login/logout', {
    account
  })
}
