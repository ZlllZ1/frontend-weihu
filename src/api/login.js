import request from '@/utils/request'

export const sendAuthCode = account => {
  return request.post('/login/sendAuthCode', {
    account
  })
}

export const judgeAuthCode = (account, authCode) => {
  return request.post('/login/judgeAuthCode', {
    account,
    authCode
  })
}

export const codeLogin = (account, authCode) => {
  return request.post('/login/codeLogin', {
    account,
    authCode
  })
}

export const logout = account => {
  return request.post('/login/logout', {
    account
  })
}
