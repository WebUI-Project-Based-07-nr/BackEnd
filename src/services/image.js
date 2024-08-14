const admin = require('firebase-admin')
const User = require('~/models/user')

const imageService = {
  getImage: async (userId) => {
    const user = await User.findById(userId)
    if (!user || !user.photo) {
      return null
    }

    return user.photo
  },

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
        await imageRef.makePublic()
        const publicUrl = `https://storage.googleapis.com/${bucket.name}/${filePath}`
        resolve(publicUrl)
      })

      blobStream.end(fileBuffer)
    })
  },

  deleteImage: async (userId) => {
    const bucket = admin.storage().bucket()
    const imagePath = `images/${userId}`
    const imageRef = bucket.file(imagePath)

    await imageRef.delete()
  }
}

module.exports = imageService
