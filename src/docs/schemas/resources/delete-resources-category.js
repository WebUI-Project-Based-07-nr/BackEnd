module.exports = {
  DeleteResourceCategoryParams: {
    type: 'object',
    required: ['id'],
    properties: {
      id: {
        type: 'string',
        description: 'ID of the resource category'
      }
    }
  }
}
