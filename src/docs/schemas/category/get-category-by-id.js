module.exports = {
  GetCategoryByIdResponse: {
    type: 'object',
    properties: {
      _id: {
        type: 'string',
        description: 'The category ID',
        example: '1234567890abcdef12345678'
      },
      name: {
        type: 'string',
        description: 'The name of the category',
        example: 'Technology'
      },
      appearance: {
        type: 'object',
        properties: {
          icon: {
            type: 'string',
            description: 'The icon associated with the category',
            example: 'mocked-path-to-icon'
          },
          color: {
            type: 'string',
            description: 'The color associated with the category',
            example: '#66C42C'
          }
        }
      }
    }
  }
}
