require('~/initialization/envSetup')
const mongoose = require("mongoose");
const { INVALID_ID } = require('~/consts/errors')
const { createError } = require('~/utils/errorsHelper')
const idValidation = require("~/middlewares/idValidation")


jest.mock("~/utils/errorsHelper", () => ({
    createError: jest.fn()
}))

describe("ID validation middleware", () => {
    let mockRequest, mockResponse, mockNextFunc;

    beforeEach(() => {
        mockRequest = {}
        mockResponse = {}
        mockNextFunc = jest.fn()
    })

    test('Should call next when id is valid', () => {
        const validId = new mongoose.Types.ObjectId().toString()

        idValidation(mockRequest, mockResponse, mockNextFunc, validId)
        expect(mockNextFunc).toHaveBeenCalled()
    })

    test('Should throw error with 400 status and INVALID_ID errorInfo when id is invalid', () => {
        const invalidId = "invalid-id"

        createError.mockImplementation((status, errorInfo) => {
            const err = new Error(errorInfo.message)
            err.status = status
            err.code = errorInfo.status

            throw err
        })

        expect(() => idValidation(
            mockRequest,
            mockResponse,
            mockNextFunc,
            invalidId
        )).toThrow(INVALID_ID.message);
        expect(mockNextFunc).not.toHaveBeenCalled()
        expect(createError).toHaveBeenCalledWith(400, INVALID_ID);
    })
})
