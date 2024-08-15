module.exports = {
  GetQuizzesResponse: {
    type: 'array',
    items: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          description: 'ID of the quiz'
        },
        title: {
          type: 'string',
          description: 'Title of the quiz'
        },
        description: {
          type: 'string',
          description: 'Description of the quiz'
        },
        items: {
          type: 'array',
          items: {
            type: 'string',
            description: 'ID of a question associated with the quiz'
          },
          description: 'Array of question IDs associated with the quiz'
        },
        author: {
          type: 'string',
          description: 'ID of the user who created the quiz'
        },
        category: {
          type: 'string',
          description: 'ID of the category to which the quiz belongs'
        },
        resourceType: {
          type: 'string',
          description: 'The type of resource this quiz is categorized under',
          enum: ['lessons', 'attachments', 'questions', 'quizzes']
        }
      },
      required: ['id', 'title', 'items', 'author', 'resourceType']
    }
  }
}
