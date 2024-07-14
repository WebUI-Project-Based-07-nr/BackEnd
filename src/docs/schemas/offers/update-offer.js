module.exports = {
  UpdateOfferParams: {
    type: 'object',
    required: ['id'],
    properties: {
      id: {
        type: 'string',
        description: 'ID of the offer'
      }
    }
  },
  UpdateOfferRequest: {
    type: 'object',
    properties: {
      categoryId: { type: 'string' }
    }
  }
}

