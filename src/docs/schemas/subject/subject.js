module.exports = {
    Subject: {
        type: 'object',
        required: ['name', 'category'],
        properties: {
            name: {
                type: 'string',
                description: 'The name of the subject. Must be unique.',
                example: 'Mathematics',
                errorMessages: {
                    required: 'The name field cannot be empty',
                    unique: 'The name must be unique'
                }
            },
            category: {
                type: 'ObjectId',
                description: 'The ID of the category to which the subject belongs.',
                ref: 'Category',
                example: '507f1f77bcf86cd799439011',
                errorMessage: 'The category field cannot be empty'
            }
        }
    }
}
