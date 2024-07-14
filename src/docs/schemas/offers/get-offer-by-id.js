module.exports = {
  GetOfferByIdParams: {
    type: 'object',
    required: ['id'],
    properties: {
      id: {
        type: 'string',
        description: 'ID of the offer'
      }
    }
  },
  GetOfferByIdResponse: {
    type: 'object',
    properties: {
      id: {
        type: 'string',
        description: 'ID of the offer'
      }
    }
  }
}
