const admin = require('firebase-admin')

const imageService = {
  uploadImage: async (fileBuffer, mimetype, userId) => {
    const bucket = admin.storage().bucket()
    const filePath = `images/${userId}`
    const imageRef = bucket.file(filePath)

    const blobStream = imageRef.createWriteStream({
      metadata: {
        contentType: mimetype
      }
    })

    return new Promise((resolve, reject) => {
      blobStream.on('error', (err) => reject(new Error('File upload failed: ' + err.message)))

      blobStream.on('finish', async () => {
        await imageRef.makePublic();
        resolve()
      })

      blobStream.end(fileBuffer)
    })
  }
}

module.exports = imageService
