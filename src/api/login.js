import request from '@/utils/request'

export const sendAuthCode = account => {
  return request.post('/login/sendAuthCode', {
    account
  })
}

export const codeLogin = (account, authCode) => {
  return request.post('/login/codeLogin', {
    account,
    authCode
  })
}

export const logOut = account => {
  return request.post('/user/logout', {
    account
  })
}
