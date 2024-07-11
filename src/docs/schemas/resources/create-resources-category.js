module.exports = {
  CreateResourcesCategoryRequest: {
    type: 'object',
    required: ['name'],
    properties: {
      name: {
        type: 'string',
        description: 'Name of the resource category'
      }
    }
  }
}
