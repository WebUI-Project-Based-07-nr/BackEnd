const mongoose = require('mongoose')
const { serverInit, serverCleanup, stopServer } = require('~/test/setup')
const tokenService = require('~/services/token')
const Category = require('~/models/category')
const Subject = require('~/models/subject')

jest.mock('~/services/token')

const categories = [
  { _id: mongoose.Types.ObjectId(), name: 'Technology', updatedAt: new Date(), subjects: [] },
  { _id: mongoose.Types.ObjectId(), name: 'Health', updatedAt: new Date(), subjects: [] },
  { _id: mongoose.Types.ObjectId(), name: 'Finance', updatedAt: new Date(), subjects: [] }
]

const subjects = [
  { _id: mongoose.Types.ObjectId(), name: 'AI', category: categories[0]._id },
  { _id: mongoose.Types.ObjectId(), name: 'Biology', category: categories[1]._id },
  { _id: mongoose.Types.ObjectId(), name: 'Finance 101', category: categories[2]._id }
]


describe('Category controller', () => {
  let app, server

  beforeAll(async () => {
    ; ({ app, server } = await serverInit())
  })

  beforeEach(async () => {
    await Category.deleteMany({});
    await Category.insertMany(categories);

    await Subject.deleteMany({});
    await Subject.insertMany(subjects);

    tokenService.validateAccessToken.mockReturnValue({ id: 'userId', role: 'user' });
  })

  afterEach(async () => {
    await serverCleanup()
  })

  afterAll(async () => {
    await stopServer(server)
  })

  test('Should return all categories with default pagination', async () => {
    const response = await app
        .get('/categories')
        .set('Cookie', `accessToken=validAccessToken`)


    expect(response.status).toBe(200)
    expect(response.body.items.length).toBe(3)
    expect(response.body.items).toEqual(
        expect.arrayContaining([
            expect.objectContaining({ name: 'Technology' }),
            expect.objectContaining({ name: 'Health' }),
            expect.objectContaining({ name: 'Finance' })
        ])
    )
  })

  test('Should apply pagination correctly', async () => {
    const response = await app
        .get('/categories?limit=2&skip=1')
        .set('Cookie', `accessToken=validAccessToken`)

    console.log(response.body.items)
    expect(response.status).toBe(200)
    expect(response.body.items.length).toBe(1)
    expect(response.body.items).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ name: 'Finance' }),
        ])
    )
  })

  test('Should filter categories by name', async () => {
    const response = await app
        .get('/categories?name=Tech')
        .set('Cookie', `accessToken=validAccessToken`)

    expect(response.status).toBe(200)
    expect(response.body.items.length).toBe(1)
    expect(response.body.items).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ name: 'Technology' }),
        ])
    )
  })

  test('Should return empty result set when no categories match the query', async () => {
    const response = await app
        .get('/categories?name=NonExistentCategory')
        .set('Cookie', `accessToken=validAccessToken`)

    expect(response.status).toBe(200)
    expect(response.body.items.length).toBe(0)
  })

  test('Should return all categories when limit exceeds the total count', async () => {
    const response = await app
        .get('/categories?limit=100')
        .set('Cookie', `accessToken=validAccessToken`)

    expect(response.status).toBe(200)
    expect(response.body.items.length).toBe(3)
  })

  test('Should exclude categories without subjects', async () => {
    await Category.create({ _id: mongoose.Types.ObjectId(), name: 'Empty category', updatedAt: new Date(), subjects: []  })

    const response = await app
        .get('/categories')
        .set('Cookie', 'accessToken=validAccessToken')

    expect(response.status).toBe(200)
    expect(response.body.items.length).toBe(3)
    expect(response.body.items).not.toEqual(
        expect.arrayContaining(([
            expect.objectContaining({ name: 'Empty category' })
        ]))
    )
  })

  test('Should throw 401 for unauthorized user', async () => {
    tokenService.validateAccessToken.mockReturnValue(null)

    const response = await app
        .get('/categories')
        .set('Cookie', `accessToken=validAccessToken`)

    expect(response.status).toBe(401)
  })
})
