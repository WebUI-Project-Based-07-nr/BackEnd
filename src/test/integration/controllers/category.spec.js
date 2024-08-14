const mongoose = require('mongoose')
const { serverInit, serverCleanup, stopServer } = require('~/test/setup')
const tokenService = require('~/services/token')
const categoryService = require('~/services/category')
const Category = require('~/models/category')
const Subject = require('~/models/subject')
const errors = require('~/consts/errors')
const { createError } = require('~/utils/errorsHelper')

jest.mock('~/services/token')
jest.mock('jsonwebtoken')

describe('Category controller', () => {
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

    describe('Category Retrieval', () => {
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

        beforeEach(async () => {
            await Category.deleteMany({})
            await Category.insertMany(categories)

            await Subject.deleteMany({})
            await Subject.insertMany(subjects)

            tokenService.validateAccessToken.mockReturnValue({ id: 'mockUserId', role: 'user' })
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

        test('Should throw 401 for unauthorized user', async () => {
            tokenService.validateAccessToken.mockReturnValue(null)

            const response = await app
                .get('/categories')
                .set('Cookie', `accessToken=validAccessToken`)

            expect(response.status).toBe(401)
        })
    })

    describe('Category Creation', () => {
        const mockCategoryData = {
            name: 'Mathematics',
            appearance: {
                icon: 'mock-icon-path',
                color: 'mock-color'
            }
        }

        beforeEach(() => {
            jest.resetAllMocks()
        })

        const mockAdminToken = () => tokenService.validateAccessToken.mockReturnValue({ id: 'mockAdminId', role: 'admin' })
        const mockUserToken = () => tokenService.validateAccessToken.mockReturnValue({ id: 'mockUserId', role: 'user' })
        const mockInvalidToken = () => tokenService.validateAccessToken.mockReturnValue(null)

        test('Should allow admin to create category', async () => {
            mockAdminToken()

            const response = await app
                .post('/categories')
                .set('Cookie', ['accessToken=fake-admin-token'])
                .send(mockCategoryData)

            expect(response.status).toBe(201)
        })

        test('Should reject non-admin users', async () => {
            mockUserToken()

            const response = await app
                .post('/categories')
                .set('Cookie', ['accessToken=fake-user-token'])
                .send(mockCategoryData)

            expect(response.status).toBe(403)
            expect(response.body).toEqual({
                status: 403,
                ...errors.FORBIDDEN
            })
        })

        test('Should reject requests with invalid token', async () => {
            mockInvalidToken()

            const response = await app
                .post('/categories')
                .set('Cookie', ['accessToken=fake-token'])
                .send(mockCategoryData)

            expect(response.status).toBe(401)
        })

        test('Should reject requests with no token', async () => {
            const response = await app
                .post('/categories')
                .send(mockCategoryData)

            expect(response.status).toBe(401)
        })

        test('Should reject requests with incomplete body', async () => {
            mockAdminToken()

            const incompleteData = { name: 'Mathematics', appearance: {} }

            const response = await app
                .post('/categories')
                .set('Cookie', ['accessToken=fake-admin-token'])
                .send(incompleteData)

            expect(response.status).toBe(400)
            expect(response.body).toEqual({
                status: 400,
                ...errors.BAD_REQUEST
            })
        })

        test('Should handle 500 internal server errors', async () => {
            mockAdminToken()

            jest.spyOn(categoryService, 'createCategory')
                .mockImplementation(() => {
                    throw new Error('Unexpected error')
                })

            const response = await app
                .post('/categories')
                .set('Cookie', ['accessToken=fake-admin-token'])
                .send(mockCategoryData)

            expect(response.status).toBe(500)
            expect(response.body).toEqual({
                ...createError(500, errors.INTERNAL_SERVER_ERROR),
                message: ''
            })
        })
    })
})
