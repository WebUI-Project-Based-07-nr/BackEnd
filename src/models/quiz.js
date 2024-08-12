const { Schema, model } = require('mongoose')

const { QUIZ, QUESTION, AUTHOR, RESOURCES_CATEGORY } = require('~/consts/models')
const {
  enum: { RESOURCES_TYPES_ENUM }
} = require('~/consts/validation')
const {
  FIELD_CANNOT_BE_EMPTY,
  FIELD_CANNOT_BE_SHORTER,
  FIELD_CANNOT_BE_LONGER,
  ENUM_CAN_BE_ONE_OF
} = require('~/consts/errors')

const quizSchema = new Schema({
  title: {
    type: String,
    required: [true, FIELD_CANNOT_BE_EMPTY('title')],
    minLength: [1, FIELD_CANNOT_BE_SHORTER('title', 1)],
    maxLength: [100, FIELD_CANNOT_BE_LONGER('title', 100)]
  },
  description: {
    type: String,
    maxLength: [150, FIELD_CANNOT_BE_LONGER('title', 150)]
  },
  items: {
    type: [{
      type: Schema.Types.ObjectId,
      ref: QUESTION
    }],
    required: [true, FIELD_CANNOT_BE_EMPTY('items')]
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: AUTHOR,
    required: [true, FIELD_CANNOT_BE_EMPTY('author')]
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: RESOURCES_CATEGORY
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

module.exports = model(QUIZ, quizSchema)
