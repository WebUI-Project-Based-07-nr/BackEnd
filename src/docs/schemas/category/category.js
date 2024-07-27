module.exports = {
    Category: {
        type: 'object',
        required: ['name', 'appearance'],
        properties: {
            name: {
                type: 'string',
                description: 'The name of the category. Must be unique.',
                example: 'Science',
                errorMessages: {
                    required: 'The name field cannot be empty',
                    unique: 'The name must be unique'
                }
            },
            appearance: {
                type: 'object',
                required: ['icon', 'color'],
                properties: {
                    icon: {
                        type: 'string',
                        description: 'The path to the category icon.',
                        example: 'path/to/icon.png',
                        default: 'mocked-path-to-icon',
                        errorMessage: 'The icon field cannot be empty'
                    },
                    color: {
                        type: 'string',
                        description: 'The color of the category icon.',
                        example: '#D99D1D',
                        default: '#66C42C',
                        errorMessage: 'The color field cannot be empty'
                    }
                }
            }
        }
    }
}
