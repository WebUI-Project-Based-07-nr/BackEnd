const errorMiddleware = require("~/middlewares/error")
const {
    INTERNAL_SERVER_ERROR,
    DOCUMENT_ALREADY_EXISTS,
    MONGO_SERVER_ERROR,
    VALIDATION_ERROR
} = require('~/consts/errors')
const logger = require('~/logger/logger')
const getUniqueFields = require('~/utils/getUniqueFields')

jest.mock('~/logger/logger')
jest.mock('~/utils/getUniqueFields')

describe("Error middleware", () => {
    let res, next;

    beforeEach(() => {
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis()
        }
        next = jest.fn()
    })

    test('Should handle MongoServerError with 11000 code', () => {
        const err = {
            name: "MongoServerError",
            code: 11000,
            message: 'duplicate key error collection: test.users index: email_1 dup key: { email: "test@example.com" }'
        }

        getUniqueFields.mockReturnValue('email')
        errorMiddleware(err, {}, res, next);

        expect(res.status).toHaveBeenCalledWith(409)
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            status: 409,
            code: DOCUMENT_ALREADY_EXISTS('email').code,
            message: DOCUMENT_ALREADY_EXISTS('email').message,
        }))
        expect(logger.error).toHaveBeenCalledWith(err)
        expect(getUniqueFields).toHaveBeenCalledWith(err.message)
    })
})