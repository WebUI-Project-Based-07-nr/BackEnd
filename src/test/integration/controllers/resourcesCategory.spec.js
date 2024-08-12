const User = require('~/models/user')
const { serverInit, serverCleanup, stopServer } = require('~/test/setup')
const { expectError } = require('~/test/helpers')
const { UNAUTHORIZED, FORBIDDEN } = require('~/consts/errors')
const testUserAuthentication = require('~/utils/testUserAuth')
const TokenService = require('~/services/token')
const {
  roles: { TUTOR, STUDENT }
} = require('~/consts/auth')

const endpointUrl = '/resources-categories/'

const testResourceCategoryData = {
  name: 'Chemical Category'
}

const updateResourceCategoryData = {
  name: 'Computer Science'
}

describe('ResourceCategory controller', () => {
  let app, server, accessToken, currentUser, testResourceCategory

  beforeAll(async () => {
    ; ({ app, server } = await serverInit())
    await serverCleanup()
  })

  beforeEach(async () => {
    accessToken = await testUserAuthentication(app, { role: TUTOR })

    currentUser = TokenService.validateAccessToken(accessToken)

    testResourceCategory = await app
      .post(endpointUrl)
      .send(testResourceCategoryData)
      .set('Cookie', [`accessToken=${accessToken}`])
  })

  afterEach(async () => {
    await serverCleanup()
    jest.restoreAllMocks()
  })

  afterAll(async () => {
    await stopServer(server)
  })

  describe(`POST ${endpointUrl}`, () => {
    it('should create a new resource category', async () => {
      expect(testResourceCategory.statusCode).toBe(201)
      expect(testResourceCategory._body).toMatchObject({
        _id: expect.any(String),
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
        author: currentUser.id,
        ...testResourceCategoryData
      })
    })

    it('should throw UNAUTHORIZED', async () => {
      const response = await app.post(endpointUrl)

      expectError(401, UNAUTHORIZED, response)
    })

    it('should throw FORBIDDEN', async () => {
      jest.spyOn(TokenService, 'validateAccessToken').mockReturnValue({ role: 'user' })

      const response = await app
        .post(endpointUrl)
        .send(testResourceCategoryData)
        .set('Cookie', [`accessToken=mockUserToken`])

      expectError(403, FORBIDDEN, response)
    })
  })

  describe(`PATCH ${endpointUrl}:id`, () => {
    it('should update resource category', async () => {
      const response = await app
        .patch(endpointUrl + testResourceCategory.body._id)
        .send(updateResourceCategoryData)
        .set('Cookie', [`accessToken=${accessToken}`])

      expect(response.statusCode).toBe(204)
    })

    it('should throw UNAUTHORIZED', async () => {
      const response = await app.patch(endpointUrl)

      expectError(401, UNAUTHORIZED, response)
    })

    it('should throw FORBIDDEN', async () => {
      jest.spyOn(TokenService, 'validateAccessToken').mockReturnValue({ role: 'user' })

      const response = await app
        .patch(endpointUrl + testResourceCategory.body._id)
        .send(updateResourceCategoryData)
        .set('Cookie', [`accessToken=mockStudentToken`])

      expectError(403, FORBIDDEN, response)
    })
  })
})
