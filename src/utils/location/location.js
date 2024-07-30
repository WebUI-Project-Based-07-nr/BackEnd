const { createError } = require('~/utils/errorsHelper')
const errors = require('~/consts/errors')

const fetchData = async (url, options) => {
    try {
        const response = await fetch(url, options)

        if (response.status === 404) {
            throw createError(404, errors.NOT_FOUND)
        }

        if (!response.ok) {
            throw createError(400, errors.BAD_REQUEST)
        }

        return await response.json()
    } catch (error) {
        if (error.code && error.message) {
            throw error
        }

        throw createError(500, errors.INTERNAL_SERVER_ERROR)
    }
}

const handleError = (res, error) => {
    let statusCode = 500

    if (error.code === errors.NOT_FOUND.code) {
        statusCode = 404
    } else if (error.code === errors.BAD_REQUEST.code) {
        statusCode = 400
    }

    res.status(statusCode).json({
        code: error.code,
        message: error.message
    })
}


module.exports = {
    fetchData,
    handleError
}
