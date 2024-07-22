const bcrypt = require('bcrypt')

const encryptPassword = async (password) => {
    return await bcrypt.hash(password, 10)
}

const comparePasswords = async (password, hash) => {
    return await bcrypt.compare(password, hash)
}

module.exports = {
    encryptPassword,
    comparePasswords
}