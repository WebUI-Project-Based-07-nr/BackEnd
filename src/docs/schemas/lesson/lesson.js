module.exports = {
    Lesson: {
        type: 'object',
        required: ['title', 'description', 'content', 'author'],
        properties: {
            title: {
                type: 'string',
                description: 'The title of the lesson. Must be between 1 and 100 characters.',
                example: 'Introduction to Quantum Mechanics',
                minLength: 1,
                maxLength: 100,
                errorMessages: {
                    required: 'The title field cannot be empty',
                    minLength: 'Title cannot be shorter 1 symbol.',
                    maxLength: 'Title cannot be longer than 100 symbol.'
                }
            },
            description: {
                type: 'string',
                description: 'A brief description of the lesson. Must be between 1 and 1000 characters.',
                example: 'This lesson covers the basic principles of quantum mechanics...',
                minLength: 1,
                maxLength: 1000,
                errorMessages: {
                    required: 'The description field cannot be empty',
                    minLength: 'Description cannot be shorter 1 symbol.',
                    maxLength: 'Description cannot be longer than 1000 symbol.'
                }
            },
            content: {
                type: 'string',
                description: 'The full content of the lesson. Must be at least 50 characters long.',
                example: 'Quantum mechanics is a fundamental theory in physics that describes...',
                minLength: 50,
                errorMessages: {
                    required: 'The content field cannot be empty',
                    minLength: 'Description cannot be shorter 50 symbol.'
                }
            },
            author: {
                type: 'string',
                description: 'The ObjectId of the user who authored the lesson.',
                example: '60d0fe4f5311236168a109ca',
                errorMessages: {
                    required: 'The author field cannot be empty'
                }
            },
            category: {
                type: 'string',
                description: 'The ObjectId of the category this lesson belongs to. Optional.',
                example: '60d0fe4f5311236168a109cb',
                default: null
            },
            resourceType: {
                type: 'string',
                description: 'The type of resource. Must be one of the predefined resource types.',
                example: 'attachments',
                default: 'lessons',
                enum: ['lessons', 'attachments', 'questions', 'quizzes'],
                errorMessages: {
                    enum: 'Resource type can be either of these: lessons,attachments,questions,quizzes'
                }
            }
        }
    }
}
