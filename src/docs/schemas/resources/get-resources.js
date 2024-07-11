module.exports = {
  GetResourcesCategoriesResponse: {
    type: 'array',
    items: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          description: 'ID of the resource category'
        }
      }
    }
  }
}
