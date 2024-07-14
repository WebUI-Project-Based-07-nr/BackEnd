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
})
