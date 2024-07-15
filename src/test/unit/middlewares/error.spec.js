const errorMiddleware = require("~/middlewares/error")
const {
    INTERNAL_SERVER_ERROR,
    DOCUMENT_ALREADY_EXISTS,
    MONGO_SERVER_ERROR,
    VALIDATION_ERROR
} = require('~/consts/errors')
const {
    expectErrorStatus,
    expectJSON,
    expectLogger
} = require("~/test/helpers")
const logger = require('~/logger/logger')
const getUniqueFields = require('~/utils/getUniqueFields')

jest.mock('~/logger/logger')
jest.mock('~/utils/getUniqueFields')

describe("Error middleware", () => {
    let res, next;

    const expectErrorHandling = (
        res,
        logger,
        err,
        expectedStatus,
        expectedCode,
        expectedMessage
    ) => {
        expectErrorStatus(res.status, expectedStatus);
        expectJSON(res.json, {
            status: expectedStatus,
            code: expectedCode,
            message: expectedMessage
        });
        expectLogger(logger.error, err);
    };


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

        expectErrorHandling(
            res,
            logger,
            err,
            409,
            DOCUMENT_ALREADY_EXISTS('email').code,
            DOCUMENT_ALREADY_EXISTS('email').message,
        )
        expect(getUniqueFields).toHaveBeenCalledWith(err.message)
    })

    test('Should handle MongoServerError with non-11000 code', () => {
        const err = {
            name: "MongoServerError",
            code: 12345,
            message: "some non-11000 mongo error"
        }

        errorMiddleware(err, {}, res, next)

        expectErrorHandling(
            res,
            logger,
            err,
            500,
            MONGO_SERVER_ERROR(err.message).code,
            MONGO_SERVER_ERROR(err.message).message,
        )
    })

    test('Should handle ValidationError', () => {
        const err = {
            name: "ValidationError",
            message: "validation failed"
        }

        errorMiddleware(err, {}, res, next)

        expectErrorHandling(
            res,
            logger,
            err,
            409,
            VALIDATION_ERROR(err.message).code,
            VALIDATION_ERROR(err.message).message,
        )
    })

    test('Should handle generic error without status and code', () => {
        const err = {
            message: 'unknown error'
        }

        errorMiddleware(err, {}, res, next)

        expectErrorHandling(
            res,
            logger,
            err,
            500,
            INTERNAL_SERVER_ERROR.code,
            err.message
        )
    })
})