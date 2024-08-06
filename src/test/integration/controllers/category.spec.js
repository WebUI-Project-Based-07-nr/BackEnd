const { serverInit, serverCleanup, stopServer } = require('~/test/setup')
const categoryService = require('~/services/category')
const errors = require('~/consts/errors')
const jwt = require('jsonwebtoken')
const { createError } = require("~/utils/errorsHelper");


describe('Category controller', () => {
    const mockCategoryData = {
        name: 'Mathematics',
        icon: 'mock-icon-path',
        color: 'mock-color'
    };

    const mockAdminToken = () => jwt.verify = jest.fn().mockReturnValue({ id: 'admin-id', role: 'admin' })
    const mockUserToken = () => jwt.verify = jest.fn().mockReturnValue({ id: 'admin-id', role: 'user' })
    const mockInvalidToken = () => jwt.verify = jest.fn(() => { throw new Error('Invalid token')})

    let app, server

    beforeAll(async () => {
        ; ({ app, server } = await serverInit())
    })

    beforeEach(() => {
        jest.resetAllMocks()
    })

    afterEach(async () => {
        await serverCleanup()
    })

    afterAll(async () => {
        await stopServer(server)
    })

    test('Should allow admin to create category', async () => {
        mockAdminToken()

        const response = await app
            .post('/category')
            .set('Cookie', ['accessToken=fake-admin-token'])
            .send(mockCategoryData)

        expect(response.status).toBe(201)
    })

    test('Should reject non-admin users', async () => {
        mockUserToken()

        const response = await app
            .post('/category')
            .set('Cookie', ['accessToken=fake-user-token'])
            .send(mockCategoryData)

        expect(response.status).toBe(403)
        expect(response.body).toEqual({
            status: 403,
            ...errors.FORBIDDEN
        });
    })

    test('Should reject requests with invalid token', async () => {
        mockInvalidToken()

        const response = await app
            .post('/category')
            .set('Cookie', ['accessToken=fake-token'])
            .send(mockCategoryData)

        expect(response.status).toBe(401)
    })

    test('Should reject requests with no token', async () => {
        const response = await app
            .post('/category')
            .send(mockCategoryData)

        expect(response.status).toBe(401)
    })

    test('Should reject requests with incomplete body', async () => {
        mockAdminToken()

        const incompleteData = { name: 'Mathematics' }

        const response = await app
            .post('/category')
            .set('Cookie', ['accessToken=fake-admin-token'])
            .send(incompleteData)

        expect(response.status).toBe(400)
        expect(response.body).toEqual({
            status: 400,
            ...errors.BAD_REQUEST
        })
    })

    test('Should handle 500', async () => {
        mockAdminToken()

        jest.spyOn(categoryService, 'createCategory')
            .mockImplementation(() => {
                throw new Error('Unexpected error');
            });

        const response = await app
            .post('/category')
            .set('Cookie', ['accessToken=fake-admin-token'])
            .send(mockCategoryData)

        expect(response.status).toBe(500)
        expect(response.body).toEqual({
            ...createError(500, errors.INTERNAL_SERVER_ERROR),
            message: ''
        })
    })
})
