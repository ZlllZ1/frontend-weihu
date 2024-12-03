import request from '@/utils/request'

export const changeShowIp = (account, showIp) => {
  return request.post(
    '/setting/changeShowIp',
    { account, showIp },
    { requiresAuth: true }
  )
}

export const changeShowFan = (account, showFan) => {
  return request.post(
    '/setting/changeShowFan',
    { account, showFan },
    { requiresAuth: true }
  )
}

export const changeShowFollow = (account, showFollow) => {
  return request.post(
    '/setting/changeShowFollow',
    { account, showFollow },
    { requiresAuth: true }
  )
}

export const changeShowPraise = (account, showPraise) => {
  return request.post(
    '/setting/changeShowPraise',
    { account, showPraise },
    { requiresAuth: true }
  )
}

export const changeShowCollect = (account, showCollect) => {
  return request.post(
    '/setting/changeShowCollect',
    { account, showCollect },
    { requiresAuth: true }
  )
}

export const changeShowShare = (account, showShare) => {
  return request.post(
    '/setting/changeShowShare',
    { account, showShare },
    { requiresAuth: true }
  )
}

export const changeShowFriend = (account, showFriend) => {
  return request.post(
    '/setting/changeShowShare',
    { account, showFriend },
    { requiresAuth: true }
  )
}

export const changeShowLive = (account, showLive) => {
  return request.post(
    '/setting/changeShowLive',
    { account, showLive },
    { requiresAuth: true }
  )
}
