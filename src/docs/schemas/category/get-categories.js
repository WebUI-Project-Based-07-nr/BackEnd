module.exports = {
  GetCategoriesResponse: {
    type: 'object',
    properties: {
      items: {
        type: 'array',
        items: {
          $ref: '#/components/schemas/Category',
        },
      },
      count: {
        type: 'integer',
        description: 'The total number of categories available',
        example: 3,
      }
    }
  }
}
