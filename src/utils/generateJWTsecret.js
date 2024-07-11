const crypto = require("crypto")

const generateJWTsecret = () => {
    return crypto.randomBytes(32).toString("hex")
}


