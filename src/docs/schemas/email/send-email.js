module.exports = {
  SendEmail: {
    type: 'object',
    required: ['to', 'subject', 'message'],
    properties: {
      to: {
        type: 'string',
        description: 'Email address of the recipient'
      },
      subject: {
        type: 'string',
        description: 'Subject of the email'
      },
      message: {
        type: 'string',
        description: 'Body content of the email'
      }
    }
  }
}
