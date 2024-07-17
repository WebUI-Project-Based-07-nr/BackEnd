jest.mock('~/utils/errorsHelper', () => ({
    createError: jest.fn((status, errorInfo) => {
        const err = new Error(errorInfo.message)
        err.status = status
        err.code = errorInfo.code

        return err
    })
}))

jest.mock('~/utils/validationHelper', () => ({
    validateRequired: jest.fn(),
    validateFunc: {
        required: jest.fn(),
        type: jest.fn(),
        length: jest.fn(),
        regex: jest.fn(),
        enum: jest.fn(),
    }
}))

const validationMiddleware = require("~/middlewares/validation")
const { BODY_IS_NOT_DEFINED } = require('~/consts/errors')
const { validateRequired, validateFunc } = require('~/utils/validationHelper')
const { createError } = require('~/utils/errorsHelper')

describe("Validation middleware", () => {
    let req, res, next

    beforeEach(() => {
        req = { body: {} }
        res = {}
        next = jest.fn()
    })

    test('Should throw BODY_IS_NOT_DEFINED with 422 status when body is not defined', () => {
        req.body = undefined

        const schema = {}

        expect(() => validationMiddleware(schema)(req, res, next))
            .toThrow(createError(422, BODY_IS_NOT_DEFINED))
    })

    test('Should call validateRequired for each field in schema', () => {
        req.body = { field1: "value1", field2: "value2" }

        const schema = {
            field1: { required: true },
            field2: { required: true }
        }

        validationMiddleware(schema)(req, res, next)

        expect(validateRequired).toHaveBeenCalledWith('field1', true, 'value1')
        expect(validateRequired).toHaveBeenCalledWith('field2', true, 'value2')
    })
})
