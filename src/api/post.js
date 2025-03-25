import request from '@/utils/request'

export const uploadCover = formData => {
  return request.post('/api/post/uploadCover', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    requiresAuth: true
  })
}

export const publishPost = data => {
  return request.post('/api/post/publishPost', data, {
    requiresAuth: true
  })
}

export const getDraft = email => {
  return request.get('/api/post/getDraft', { email }, { requiresAuth: true })
}

export const saveDraft = data => {
  return request.post('/api/post/saveToDraft', data, {
    requiresAuth: true
  })
}

export const publishSchedulePost = data => {
  return request.post('/api/post/publishScheduledPost', data, {
    requiresAuth: true
  })
}

export const getPosts = (email, page, limit, type) => {
  return request.get(
    '/api/post/getPosts',
    { email, page, limit, type },
    { requiresAuth: true }
  )
}

export const praisePost = (email, postId) => {
  return request.post(
    '/api/post/praisePost',
    { email, postId },
    { requiresAuth: true }
  )
}

export const collectPost = (email, postId) => {
  return request.post(
    '/api/post/collectPost',
    { email, postId },
    { requiresAuth: true }
  )
}

export const getPostInfo = (postId, email) => {
  return request.get(
    '/api/post/getPostInfo',
    { postId, email },
    { requiresAuth: true }
  )
}

export const getPublishedPosts = (email, page, limit) => {
  return request.get(
    '/api/post/getPublishedPosts',
    { email, page, limit },
    { requiresAuth: true }
  )
}

export const getMyPosts = (email, page, limit, type = '', userEmail = '') => {
  return request.get(
    '/api/post/getOnesPosts',
    { email, page, limit, type, userEmail },
    { requiresAuth: true }
  )
}

export const updateShareNum = postId => {
  return request.post(
    '/api/post/updateShareNum',
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
    '/api/post/comment',
    { email, postId, content, parentId, parentEmail, postEmail },
    { requiresAuth: true }
  )
}

export const getComments = (postId, email, page, limit) => {
  return request.get(
    '/api/post/getComments',
    { postId, email, page, limit },
    { requiresAuth: true }
  )
}

export const praiseComments = (email, commentId) => {
  return request.post(
    '/api/post/praiseComment',
    { email, commentId },
    { requiresAuth: true }
  )
}

export const clearDraft = email => {
  return request.post('/api/post/clearDraft', { email }, { requiresAuth: true })
}

export const deletePost = (postId, email) => {
  return request.post(
    '/api/post/deletePost',
    { postId, email },
    { requiresAuth: true }
  )
}

export const hidePost = (postId, email) => {
  return request.post(
    '/api/post/hidePost',
    { postId, email },
    { requiresAuth: true }
  )
}

export const showPost = (postId, email) => {
  return request.post(
    '/api/post/showPost',
    { postId, email },
    { requiresAuth: true }
  )
}

export const deleteComments = (postId, email, commentId) => {
  return request.post(
    '/api/post/deleteComment',
    { postId, email, commentId },
    { requiresAuth: true }
  )
}

export const uploadPostImg = formData => {
  return request.post('/api/post/uploadPostImg', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    requiresAuth: true
  })
}

export const search = (searchQuery, type, page = 1, limit = 30) => {
  return request.post(
    '/api/post/search',
    { searchQuery, type, page, limit },
    { requiresAuth: true }
  )
}
