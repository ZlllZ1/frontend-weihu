import request from '@/utils/request'

export const uploadCover = formData => {
  return request.post('/post/uploadCover', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    requiresAuth: true
  })
}

export const publishPost = data => {
  return request.post('/post/publishPost', data, {
    requiresAuth: true
  })
}

export const getDraft = email => {
  return request.get('/post/getDraft', { email }, { requiresAuth: true })
}

export const saveDraft = data => {
  return request.post('/post/saveToDraft', data, {
    requiresAuth: true
  })
}

export const publishSchedulePost = data => {
  return request.post('/post/publishScheduledPost', data, {
    requiresAuth: true
  })
}

export const getPosts = (email, page, limit) => {
  return request.get(
    '/post/getPosts',
    { email, page, limit },
    { requiresAuth: true }
  )
}

export const praisePost = (email, postId) => {
  return request.post(
    '/post/praisePost',
    { email, postId },
    { requiresAuth: true }
  )
}

export const collectPost = (email, postId) => {
  return request.post(
    '/post/collectPost',
    { email, postId },
    { requiresAuth: true }
  )
}
