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

const updateQuestionHandler = async (req, res, updateQuestionService) => {
  const { id } = req.params;
  const { id: currentUserId } = req.user;
  const data = req.body;

  try {
    const updatedQuestion = await updateQuestionService(id, currentUserId, data);
    res.status(200).json(updatedQuestion);
  } catch (error) {
    res.status(error.status || 500).json({ code: error.code, message: error.message });
  }
};

const updateQuestionHelper = (req, res) => {
  return updateQuestionHandler(req, res, questionService.updateQuestion);
};

module.exports = {
  expectError ,
  expectErrorStatus,
  expectJSON,
  expectLogger,
  updateQuestionHandler,
  updateQuestionHelper
}
