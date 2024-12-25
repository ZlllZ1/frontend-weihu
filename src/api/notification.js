import request from '@/utils/request'

export const judgeNewNotification = userId => {
  return request.post(
    '/notification/judgeNewNotification',
    { userId },
    { requiresAuth: true }
  )
}

export const getNotifications = (userId, type, page, limit) => {
  return request.get(
    '/notification/getNotifications',
    { userId, type, page, limit },
    { requiresAuth: true }
  )
}

export const readNew = (userId, type) => {
  return request.post(
    '/notification/readNew',
    { userId, type },
    { requiresAuth: true }
  )
}
