module.exports = {
  GetQuestionsResponse: {
    type: 'array',
    items: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          description: 'ID of the question'
        }
      }
    }
  }
}
