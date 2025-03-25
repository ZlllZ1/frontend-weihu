import request from '@/utils/request'

export const publishCircle = data => {
  return request.post('/circle/publishCircle', data, {
    requiresAuth: true
  })
}

export const getCircles = (email, page, limit) => {
  return request.get(
    '/api/circle/getCircles',
    { email, page, limit },
    { requiresAuth: true }
  )
}

export const praiseCircle = (email, circleId) => {
  return request.post(
    '/api/circle/praiseCircle',
    { email, circleId },
    { requiresAuth: true }
  )
}

export const uploadCircleImg = formData => {
  return request.post('/circle/uploadCircleImg', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    requiresAuth: true
  })
}

export const handleComment = (
  email,
  circleId,
  content,
  parentId = null,
  parentEmail = null,
  circleEmail
) => {
  return request.post(
    '/api/circle/commentCircle',
    { email, circleId, content, parentId, parentEmail, circleEmail },
    { requiresAuth: true }
  )
}

export const getCircleComments = (email, circleEmail, circleId) => {
  return request.get(
    '/api/circle/getCircleComments',
    { email, circleEmail, circleId },
    { requiresAuth: true }
  )
}

export const getPraiseUsers = (email, circleEmail, circleId) => {
  return request.get(
    '/api/circle/getPraiseUsers',
    { email, circleEmail, circleId },
    { requiresAuth: true }
  )
}

export const getMyCircles = (email, visitEmail, type, page, limit) => {
  return request.get(
    '/api/circle/getMyCircles',
    { email, visitEmail, type, page, limit },
    { requiresAuth: true }
  )
}

export const deleteCircle = (email, circleId) => {
  return request.post(
    '/api/circle/deleteCircle',
    { circleId, email },
    { requiresAuth: true }
  )
}

export const hideCircle = (email, circleId) => {
  return request.post(
    '/circle/hideCircle',
    { circleId, email },
    { requiresAuth: true }
  )
}

export const showCircle = (email, circleId) => {
  return request.post(
    '/circle/showCircle',
    { circleId, email },
    { requiresAuth: true }
  )
}

export const deleteComments = (circleId, email, commentId) => {
  return request.post(
    '/circle/deleteComment',
    { circleId, email, commentId },
    { requiresAuth: true }
  )
}
