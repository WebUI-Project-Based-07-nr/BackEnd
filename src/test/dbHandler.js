const mongoose = require('mongoose')
const { MongoMemoryServer } = require('mongodb-memory-server')

let mongod

const connect = async () => {
  mongod = await MongoMemoryServer.create()
  const uri = await mongod.getUri()

  await mongoose.connect(uri, {
    dbName: 'verifyMongooseSprint'
  })
}

const closeDatabase = async () => {
  await mongoose.connection.dropDatabase()
  await mongod.stop()
  await mongoose.connection.close()
}

const clearDatabase = async () => {
  const { collections } = mongoose.connection

  Object.keys(collections).forEach(async (key) => {
    const collection = collections[key]
    await collection.deleteMany()
  })
}

module.exports = { connect, closeDatabase, clearDatabase }
