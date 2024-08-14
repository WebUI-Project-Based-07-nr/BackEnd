module.exports = {
  CreateQuizResponse: {
    type: 'object',
    properties: {
      status: {
        type: 'string',
        description: 'Indicates the success status of the request',
        example: 'success'
      },
      data: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'ID of the newly created quiz'
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
            enum: ['lessons', 'exams', 'assignments'] // Example enum values
          }
        },
        required: ['id', 'title', 'items', 'author', 'resourceType']
      }
    },
    required: ['status', 'data']
  }
}
