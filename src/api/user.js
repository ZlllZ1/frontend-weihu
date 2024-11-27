import request from '@/utils/request'

export const getUserInfo = account => {
  return request.get('/user/getUserInfo', { account })
}

export const saveNickname = (account, nickname) => {
  return request.post('/user/changeNickname', { account, nickname })
}

export const saveSex = (account, sex) => {
  return request.post('/user/changeSex', { account, sex })
}

export const saveEmail = (account, email) => {
  return request.post('/user/changeEmail', { account, email })
}
