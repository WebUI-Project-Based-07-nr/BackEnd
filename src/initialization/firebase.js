const admin = require('firebase-admin')
const { firebase } = require('~/configs/config')
const serviceAccount = require('../../firebase-service-account.json')

const initializeFirebase = () => {
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      storageBucket: firebase.BUCKET_URL_FIREBASE
    })
  }
}

module.exports = initializeFirebase

