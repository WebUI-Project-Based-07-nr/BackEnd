module.exports = {
  DeleteQuestionParams: {
    type: 'object',
    required: ['id'],
    properties: {
      id: {
        type: 'string',
        description: 'ID of the question'
      }
    }
  }
}
