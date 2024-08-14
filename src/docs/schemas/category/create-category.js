module.exports = {
    CreateCategoryRequest: {
        type: 'object',
        required: ['name', 'appearance'],
        properties: {
            name: {
                type: 'string',
                description: 'The name of the category. This field is required.',
                example: 'Electronics'
            },
            appearance: {
                type: 'object',
                required: ['icon', 'color'],
                properties: {
                    icon: {
                        type: 'string',
                        description: 'The icon representing the category (URL or icon name). This field is required.',
                        example: 'https://example.com/icon.png',
                        default: 'mocked-path-to-icon'
                    },
                    color: {
                        type: 'string',
                        description: 'The color associated with the category (hex code). This field is required.',
                        example: '#FF5733',
                        default: '#66C42C'
                    }
                }
            }
        }
    }
}
