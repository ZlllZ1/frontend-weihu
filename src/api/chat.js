import request from '@/utils/request'

export const getFriendLists = email => {
  return request.get('/chat/getFriendLists', { email }, { requiresAuth: true })
}

export const getChatInfos = (email, chatId) => {
  return request.get(
    '/chat/getChatInfos',
    { email, chatId },
    { requiresAuth: true }
  )
}

export const uploadChatImg = formData => {
  return request.post('/chat/uploadChatImg', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    requiresAuth: true
  })
}
