/* eslint-env worker */
/* global SparkMD5:false */
importScripts(
  'https://cdnjs.cloudflare.com/ajax/libs/spark-md5/3.0.0/spark-md5.min.js'
)
const CHUNK_SIZE = 2 * 1024 * 1024

self.onmessage = async e => {
  const { file, email, token } = e.data
  try {
    const fileMD5 = await calculateFileMD5(file)
    const totalChunks = Math.ceil(file.size / CHUNK_SIZE)
    for (let i = 0; i < totalChunks; i++) {
      const start = i * CHUNK_SIZE
      const end = Math.min(file.size, start + CHUNK_SIZE)
      const chunk = file.slice(start, end)
      await uploadChunk(chunk, i, totalChunks, file.name, fileMD5, email, token)
      const progress = Math.round(((i + 1) / totalChunks) * 100)
      self.postMessage({ type: 'progress', progress })
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
      File.prototype.slice ||
      File.prototype.mozSlice ||
      File.prototype.webkitSlice
    const chunkSize = 2097152
    const chunks = Math.ceil(file.size / chunkSize)
    let currentChunk = 0
    const spark = new SparkMD5.ArrayBuffer()
    const fileReader = new FileReader()
    fileReader.onload = e => {
      spark.append(e.target.result)
      currentChunk++
      if (currentChunk < chunks) loadNext()
      else resolve(spark.end())
    }
    fileReader.onerror = e => reject(e)
    const loadNext = () => {
      const start = currentChunk * chunkSize
      const end = Math.min(file.size, start + chunkSize)
      fileReader.readAsArrayBuffer(blobSlice.call(file, start, end))
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
  console.log('test')
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
