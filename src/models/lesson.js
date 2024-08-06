const { Schema, model} = require('mongoose')

const { LESSON, USER, RESOURCES_CATEGORY } = require('~/consts/models')
const {
    enum: { RESOURCES_TYPES_ENUM }
} = require('~/consts/validation')
const {
    FIELD_CANNOT_BE_EMPTY,
    FIELD_CANNOT_BE_SHORTER,
    FIELD_CANNOT_BE_LONGER,
    ENUM_CAN_BE_ONE_OF
} = require('~/consts/errors')

const lessonSchema = new Schema({
    title: {
        type: String,
        required: [true, FIELD_CANNOT_BE_EMPTY('title')],
        minLength: [1, FIELD_CANNOT_BE_SHORTER('title', 1)],
        maxLength: [100, FIELD_CANNOT_BE_LONGER('title', 100)]
    },
    description: {
        type: String,
        required: [true, FIELD_CANNOT_BE_EMPTY('description')],
        minLength: [1, FIELD_CANNOT_BE_SHORTER('description', 1)],
        maxLength: [1000, FIELD_CANNOT_BE_LONGER('description', 1000)]
    },
    content: {
        type: String,
        required: [true, FIELD_CANNOT_BE_EMPTY('content')],
        minLength: [50, FIELD_CANNOT_BE_SHORTER('content', 50)]
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: USER,
        required: [true, FIELD_CANNOT_BE_EMPTY('author')]
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: RESOURCES_CATEGORY,
        default: null
    },
    resourceType: {
        type: String,
        enum: {
            values: RESOURCES_TYPES_ENUM,
            message: ENUM_CAN_BE_ONE_OF('resource type', RESOURCES_TYPES_ENUM)
        },
        default: RESOURCES_TYPES_ENUM[0]
    }
})

module.exports = model(LESSON, lessonSchema)
