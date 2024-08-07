const imageService = require('~/services/image')
const User = require('~/models/user')

const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send({ error: 'No file uploaded' })
    }

    const userId = req.user.id
    const buffer = req.file.buffer
    const mimetype = req.file.mimetype

    await imageService.uploadImage(buffer, mimetype, mimetype)

    await User.findByIdAndUpdate(userId, { photo: `images/${userId}` })

    res.status(200).send({ message: 'File uploaded successfully' })
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
}

module.exports = {
  uploadImage
}
