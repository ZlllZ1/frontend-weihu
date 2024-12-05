import request from '@/utils/request'

export const commitError = errorContent => {
  return request.post('/other/commitErrorLog', { errorContent })
}
