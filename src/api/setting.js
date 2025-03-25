import request from '@/utils/request'

export const changeShowIp = (account, showIp) => {
  return request.post(
    '/api/setting/changeShowIp',
    { account, showIp },
    { requiresAuth: true }
  )
}

export const changeShowFan = (account, showFan) => {
  return request.post(
    '/api/setting/changeShowFan',
    { account, showFan },
    { requiresAuth: true }
  )
}

export const changeShowFollow = (account, showFollow) => {
  return request.post(
    '/api/setting/changeShowFollow',
    { account, showFollow },
    { requiresAuth: true }
  )
}

export const changeShowPraise = (account, showPraise) => {
  return request.post(
    '/api/setting/changeShowPraise',
    { account, showPraise },
    { requiresAuth: true }
  )
}

export const changeShowCollect = (account, showCollect) => {
  return request.post(
    '/api/setting/changeShowCollect',
    { account, showCollect },
    { requiresAuth: true }
  )
}

export const changeShowShare = (account, showShare) => {
  return request.post(
    '/api/setting/changeShowShare',
    { account, showShare },
    { requiresAuth: true }
  )
}

export const changeShowFriend = (account, showFriend) => {
  return request.post(
    '/api/setting/changeShowShare',
    { account, showFriend },
    { requiresAuth: true }
  )
}

export const changeShowLive = (account, showLive) => {
  return request.post(
    '/api/setting/changeShowLive',
    { account, showLive },
    { requiresAuth: true }
  )
}

export const changeChatLimit = (account, chatLimit) => {
  return request.post(
    '/api/setting/changeChatLimit',
    { account, chatLimit },
    { requiresAuth: true }
  )
}

export const changeCircleLimit = (account, circleLimit) => {
  return request.post(
    '/api/setting/changeCircleLimit',
    { account, circleLimit },
    { requiresAuth: true }
  )
}

export const changePostLimit = (account, postLimit) => {
  return request.post(
    '/api/setting/changePostLimit',
    { account, postLimit },
    { requiresAuth: true }
  )
}
