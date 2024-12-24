import request from '@/utils/request'

export const getFriendLists = email => {
  return request.get('/chat/getFriendLists', { email }, { requiresAuth: true })
}

export const getChatInfos = (email, chatId, page, limit) => {
  return request.get(
    '/chat/getChatInfos',
    { email, chatId, page, limit },
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

export const sendMessages = (chatId, content, senderEmail, recipientEmail) => {
  return request.post(
    '/chat/sendMessages',
    { chatId, content, senderEmail, recipientEmail },
    { requiresAuth: true }
  )
}

export const readMessages = (chatId, email, senderEmail) => {
  return request.post(
    '/chat/readMessages',
    { chatId, email, senderEmail },
    { requiresAuth: true }
  )
}
