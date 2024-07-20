const expectError = (statusCode, error, response) => {
  expect(response.body).toEqual({
    ...error,
    status: statusCode
  })
}

const expectErrorStatus = (statusCode, expectedStatusCode) => {
  expect(statusCode).toHaveBeenCalledWith(expectedStatusCode);
}

const expectJSON = (json, expectedJSON) => {
  expect(json).toHaveBeenCalledWith(expectedJSON)
}

const expectLogger = (loggerError, errorMessage) => {
  expect(loggerError).toHaveBeenCalledWith(errorMessage)
}

module.exports = {
  expectError ,
  expectErrorStatus,
  expectJSON,
  expectLogger
}
