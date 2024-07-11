module.exports = {
  UpdateResourceCategoryParams: {
    type: 'object',
    required: ['id'],
    properties: {
      id: {
        type: 'string',
        description: 'ID of the resource category'
      }
    }
  },
  UpdateResourceCategoryRequest: {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        description: 'Updated name of the resource category'
      }
    }
  }
}
