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