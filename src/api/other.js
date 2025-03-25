import request from '@/utils/request'

export const commitError = errorContent => {
  return request.post('/api/other/commitErrorLog', { errorContent })
}

export const savePassword = (account, password) => {
  return request.post('/api/other/changePassword', { account, password })
}
