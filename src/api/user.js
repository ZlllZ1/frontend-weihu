import request from '@/utils/request'

export const getUserInfo = account => {
  return request.get('/user/getUserInfo', { account }, { requiresAuth: true })
}

export const saveNickname = (account, nickname) => {
  return request.post(
    '/user/changeNickname',
    { account, nickname },
    { requiresAuth: true }
  )
}

export const saveSex = (account, sex) => {
  return request.post(
    '/user/changeSex',
    { account, sex },
    { requiresAuth: true }
  )
}

export const saveLive = (account, live) => {
  return request.post(
    '/user/changeLive',
    { account, live },
    { requiresAuth: true }
  )
}

export const saveEmail = (account, email) => {
  return request.post(
    '/user/changeEmail',
    { account, email },
    { requiresAuth: true }
  )
}

export const savePassword = (account, password) => {
  return request.post(
    '/user/changePassword',
    { account, password },
    { requiresAuth: true }
  )
}

export const saveIntroduction = (account, introduction) => {
  return request.post(
    '/user/changeIntroduction',
    { account, introduction },
    { requiresAuth: true }
  )
}

export const saveBirthDate = (account, birthDate) => {
  return request.post(
    '/user/changeBirthDate',
    { account, birthDate },
    { requiresAuth: true }
  )
}

export const uploadAvatar = formData => {
  return request.post('/user/changeAvatar', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    requiresAuth: true
  })
}

export const uploadHomeBg = formData => {
  return request.post('/user/changeHomeBg', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    requiresAuth: true
  })
}

export const uploadCircleBg = formData => {
  return request.post('/user/changeCircleBg', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    requiresAuth: true
  })
}

export const followUser = (fanEmail, followedEmail) => {
  return request.post(
    '/user/followUser',
    { fanEmail, followedEmail },
    { requiresAuth: true }
  )
}
