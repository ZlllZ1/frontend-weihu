import request from '@/utils/request'

export const publishCircle = data => {
  return request.post('/circle/publishCircle', data, {
    requiresAuth: true
  })
}

export const getCircles = (email, page, limit) => {
  return request.get(
    '/circle/getCircles',
    { email, page, limit },
    { requiresAuth: true }
  )
}

export const praiseCircle = (email, circleId) => {
  return request.post(
    '/circle/praiseCircle',
    { email, circleId },
    { requiresAuth: true }
  )
}
