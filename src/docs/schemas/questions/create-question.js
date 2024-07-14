module.exports = {
  CreateQuestionRequest: {
    type: 'object',
    required: ['title', 'description'],
    properties: {
      title: {
        type: 'string',
        description: 'Title of the question'
      },
      description: {
        type: 'string',
        description: 'Description of the question'
      }
    }
  }
}
