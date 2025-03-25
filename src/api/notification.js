import request from '@/utils/request'

export const judgeNewNotification = userId => {
  return request.post(
    '/api/notification/judgeNewNotification',
    { userId },
    { requiresAuth: true }
  )
}

export const getNotifications = (userId, type, page, limit) => {
  return request.get(
    '/api/notification/getNotifications',
    { userId, type, page, limit },
    { requiresAuth: true }
  )
}

export const readNew = (userId, type) => {
  return request.post(
    '/api/notification/readNew',
    { userId, type },
    { requiresAuth: true }
  )
}
