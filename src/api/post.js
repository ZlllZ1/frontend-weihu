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

export const getPosts = (email, page, limit, type) => {
  return request.get(
    '/post/getPosts',
    { email, page, limit, type },
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

export const getPostInfo = (postId, email) => {
  return request.get(
    '/post/getPostInfo',
    { postId, email },
    { requiresAuth: true }
  )
}

export const getPublishedPosts = (email, page, limit) => {
  return request.get(
    '/post/getPublishedPosts',
    { email, page, limit },
    { requiresAuth: true }
  )
}

export const getMyPosts = (email, page, limit, type = '', userEmail = '') => {
  return request.get(
    '/post/getOnesPosts',
    { email, page, limit, type, userEmail },
    { requiresAuth: true }
  )
}

export const updateShareNum = postId => {
  return request.post(
    '/post/updateShareNum',
    { postId },
    { requiresAuth: true }
  )
}

export const commentPost = (
  email,
  postId,
  content,
  parentId = null,
  parentEmail = null,
  postEmail
) => {
  return request.post(
    '/post/comment',
    { email, postId, content, parentId, parentEmail, postEmail },
    { requiresAuth: true }
  )
}

export const getComments = (postId, email, page, limit) => {
  return request.get(
    '/post/getComments',
    { postId, email, page, limit },
    { requiresAuth: true }
  )
}

export const praiseComments = (email, commentId) => {
  return request.post(
    '/post/praiseComment',
    { email, commentId },
    { requiresAuth: true }
  )
}
