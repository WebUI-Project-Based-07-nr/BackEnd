module.exports = {
  GetQuestionByIdParams: {
    type: 'object',
    required: ['questionId'],
    properties: {
      questionId: {
        type: 'string',
        description: 'ID of the question'
      }
    }
  },
  GetQuestionByIdResponse: {
    type: 'object',
    properties: {
      id: {
        type: 'string',
        description: 'ID of the question'
      }
    }
  }
}
