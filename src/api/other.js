import request from '@/utils/request'

export const commitError = errorContent => {
  return request.post('/other/commitErrorLog', { errorContent })
}

export const savePassword = (account, password) => {
  return request.post('/other/changePassword', { account, password })
}
