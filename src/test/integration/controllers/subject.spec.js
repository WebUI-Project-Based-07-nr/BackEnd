const mongoose = require('mongoose')
const { serverInit, serverCleanup, stopServer } = require('~/test/setup')
const tokenService = require('~/services/token')
const Category = require('~/models/category')
const Subject = require('~/models/subject')
const jwt = require('jsonwebtoken')
const errors = require('~/consts/errors')

jest.mock('~/services/token')
jest.mock('jsonwebtoken')

const categories = [
  { _id: mongoose.Types.ObjectId(), name: 'Technology', updatedAt: new Date(), subjects: [] },
  { _id: mongoose.Types.ObjectId(), name: 'Health', updatedAt: new Date(), subjects: [] }
]

const subjects = [
  { _id: mongoose.Types.ObjectId(), name: 'AI', category: categories[0]._id },
  { _id: mongoose.Types.ObjectId(), name: 'Biology', category: categories[1]._id }
]

describe('Subject controller', () => {
  let app, server

  beforeAll(async () => {
    ;({ app, server } = await serverInit())
  })

  afterEach(async () => {
    await serverCleanup()
  })

  afterAll(async () => {
    await stopServer(server)
  })

  describe('Subject Retrieval', () => {
    beforeEach(async () => {
      await Category.deleteMany({})
      await Category.insertMany(categories)
      await Subject.deleteMany({})
      await Subject.insertMany(subjects)

      tokenService.validateAccessToken.mockReturnValue({ id: 'userId', role: 'user' })
    })

    test('Should return all subjects with default pagination', async () => {
      const response = await app.get('/subjects').set('Cookie', 'accessToken=validAccessToken')

      expect(response.status).toBe(200)
      expect(response.body.items.length).toBe(2)
      expect(response.body.items).toEqual(
        expect.arrayContaining([expect.objectContaining({ name: 'AI' }), expect.objectContaining({ name: 'Biology' })])
      )
    })

    test('Should filter subjects by category', async () => {
      const response = await app.get('/subjects?limit=2&skip=1').set('Cookie', 'accessToken=validAccessToken')

      expect(response.status).toBe(200)
      expect(response.body.items.length).toBe(1)
      expect(response.body.items).toEqual(expect.arrayContaining([expect.objectContaining({ name: 'Biology' })]))
    })

    test('Should return empty result set when no subjects match the query', async () => {
      const response = await app
        .get('/subjects?category=nonexistentCategory')
        .set('Cookie', 'accessToken=validAccessToken')

      expect(response.status).toBe(200)
      expect(response.body.items.length).toBe(0)
    })

    test('Should throw 401 for unauthorized user', async () => {
      tokenService.validateAccessToken.mockReturnValue(null)
      const response = await app.get('/subjects').set('Cookie', 'accessToken=validAccessToken')

      expect(response.status).toBe(401)
    })
  })

  describe('Subject Creation', () => {
    beforeEach(async () => {
      await Category.deleteMany({})
      await Category.insertMany(categories)
      await Subject.deleteMany({})

      jest.resetAllMocks()
    })

    const mockInvalidToken = () =>
      (jwt.verify = jest.fn(() => {
        throw new Error('Invalid token')
      }))

    const mockSubjectData = {
      name: 'Physics',
      categoryId: categories[0]._id
    }

    test('Should allow admin to create subject', async () => {
      tokenService.validateAccessToken.mockReturnValue({ id: 'admin-id', role: 'admin' })
      const response = await app.post('/subjects').set('Cookie', ['accessToken=fake-admin-token']).send(mockSubjectData)

      expect(response.status).toBe(201)
    })

    test('Should reject non-admin users', async () => {
      const response = await app.post('/subjects').set('Cookie', ['accessToken=fake-user-token']).send(mockSubjectData)

      expect(response.status).toBe(401)
      expect(response.body).toEqual({
        status: 401,

        ...errors.UNAUTHORIZED
      })
    })

    test('Should reject requests with invalid token', async () => {
      mockInvalidToken()
      const response = await app.post('/subjects').set('Cookie', ['accessToken=fake-token']).send(mockSubjectData)

      expect(response.status).toBe(401)
    })

    test('Should reject requests with no token', async () => {
      const response = await app.post('/subjects').send(mockSubjectData)

      expect(response.status).toBe(401)
    })
  })
})
