module.exports = {
  DeleteOfferParams: {
    type: 'object',
    required: ['id'],
    properties: {
      id: {
        type: 'string',
        description: 'ID of the offer'
      }
    }
  }
}
