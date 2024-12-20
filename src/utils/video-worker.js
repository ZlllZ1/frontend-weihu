/* eslint-env worker */
importScripts(
  'https://cdnjs.cloudflare.com/ajax/libs/spark-md5/3.0.0/spark-md5.min.js'
)
const CHUNK_SIZE = 2 * 1024 * 1024

self.onmessage = async e => {
  const { file, email, token } = e.data
  try {
    const fileMD5 = await calculateFileMD5(file) // 计算文件MD5
    const totalChunks = Math.ceil(file.size / CHUNK_SIZE) // 总切片数
    for (let i = 0; i < totalChunks; i++) {
      const start = i * CHUNK_SIZE // 每个切片的起始位置
      const end = Math.min(file.size, start + CHUNK_SIZE) // 每个切片的结束位置
      const chunk = file.slice(start, end) // 切片
      await uploadChunk(chunk, i, totalChunks, file.name, fileMD5, email, token) // 上传切片
      const progress = Math.round(((i + 1) / totalChunks) * 100) // 进度
      self.postMessage({ type: 'progress', progress }) // 发送进度消息
    }
    const mergeResponse = await mergeVideoChunks(
      file.name,
      fileMD5,
      email,
      token
    )
    if (mergeResponse.code !== 200) return
    self.postMessage({
      type: 'success',
      videoUrl: mergeResponse.data.data.videoUrl
    })
  } catch (err) {
    self.postMessage({ type: 'error', message: err.message })
  }
}

self.onerror = error => console.error('Worker internal error:', error)

const calculateFileMD5 = file => {
  return new Promise((resolve, reject) => {
    const blobSlice =
      File.prototype.slice || // Chrome
      File.prototype.mozSlice || // Firefox
      File.prototype.webkitSlice // IE11+
    const chunkSize = 2097152 // 2MB
    const chunks = Math.ceil(file.size / chunkSize) // 总切片数
    let currentChunk = 0 // 当前切片数
    const spark = new SparkMD5.ArrayBuffer() // 创建一个SparkMD5对象
    const fileReader = new FileReader() // 创建一个FileReader对象
    fileReader.onload = e => {
      spark.append(e.target.result) // 将文件内容追加到SparkMD5对象中
      currentChunk++ // 当前切片数加1
      if (currentChunk < chunks)
        loadNext() // 如果当前切片数小于总切片数，则继续加载下一个切片
      else resolve(spark.end()) // 如果当前切片数等于总切片数，则结束加载
    }
    fileReader.onerror = e => reject(e)
    const loadNext = () => {
      const start = currentChunk * chunkSize // 每个切片的起始位置
      const end = Math.min(file.size, start + chunkSize) // 每个切片的结束位置
      fileReader.readAsArrayBuffer(blobSlice.call(file, start, end)) // 读取文件内容
    }
    loadNext()
  })
}

const uploadChunk = async (
  chunk,
  chunkIndex,
  totalChunks,
  fileName,
  fileMD5,
  email,
  token
) => {
  const formData = new FormData()
  formData.append('chunk', chunk)
  formData.append('chunkIndex', chunkIndex)
  formData.append('totalChunks', totalChunks)
  formData.append('fileName', fileName)
  formData.append('fileMD5', fileMD5)
  formData.append('email', email)
  const response = await fetch('http://127.0.0.1:3007/circle/uploadChunk', {
    method: 'POST',
    body: formData,
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  if (!response.ok) throw new Error('Chunk upload failed')
  return response.json()
}

const mergeVideoChunks = async (fileName, fileMD5, email, token) => {
  const response = await fetch('http://127.0.0.1:3007/circle/mergeChunks', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ fileName, fileMD5, email })
  })
  if (!response.ok) throw new Error('Video merge request failed')
  return response.json()
}
