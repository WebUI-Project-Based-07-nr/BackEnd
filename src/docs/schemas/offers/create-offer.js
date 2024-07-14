module.exports = {
  CreateOfferRequest: {
    type: 'object',
    required: ['categoryId', 'subjectId'],
    properties: {
      categoryId: {
        type: 'string',
        description: 'ID of the category'
      },
      subjectId: {
        type: 'string',
        description: 'ID of the subject'
      }
    }
  }
}
