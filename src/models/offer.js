const { Schema, model } = require('mongoose')

const {
  enums: { MAIN_ROLE_ENUM, SPOKEN_LANG_ENUM, PROFICIENCY_LEVEL_ENUM, OFFER_STATUS_ENUM }
} = require('~/consts/validation')
const { USER, OFFER, CATEGORY, SUBJECT } = require('~/consts/models')
const {
  ENUM_CAN_BE_ONE_OF,
  FIELD_CANNOT_BE_EMPTY,
  VALUE_MUST_BE_ABOVE,
  FIELD_CANNOT_BE_SHORTER,
  FIELD_CANNOT_BE_LONGER
} = require('~/consts/errors')

const offerSchema = new Schema(
  {
    price: {
      type: Number,
      min: [1, VALUE_MUST_BE_ABOVE('price', 1)],
      required: [true, FIELD_CANNOT_BE_EMPTY('price')]
    },
    proficiencyLevel: {
      type: String,
      enum: {
        values: PROFICIENCY_LEVEL_ENUM,
        message: ENUM_CAN_BE_ONE_OF('proficiency level', PROFICIENCY_LEVEL_ENUM)
      },
      required: [true, FIELD_CANNOT_BE_EMPTY('proficiency level')]
    },
    title: {
      type: String,
      required: [true, FIELD_CANNOT_BE_EMPTY('title')],
      trim: true,
      minLength: [1, FIELD_CANNOT_BE_SHORTER('title', 1)],
      maxLength: [100, FIELD_CANNOT_BE_LONGER('title', 100)]
    },
    description: {
      type: String,
      required: [true, FIELD_CANNOT_BE_EMPTY('description')],
      trim: true,
      minLength: [1, FIELD_CANNOT_BE_SHORTER('description', 1)],
      maxLength: [1000, FIELD_CANNOT_BE_LONGER('description', 1000)],
    },
    languages: {
      type: [String],
      enum: {
        values: SPOKEN_LANG_ENUM,
        message: ENUM_CAN_BE_ONE_OF('language', SPOKEN_LANG_ENUM)
      },
      required: [true, FIELD_CANNOT_BE_EMPTY('languages')]
    },
    authorRole: {
      type: String,
      enum: {
        values: MAIN_ROLE_ENUM,
        message: ENUM_CAN_BE_ONE_OF('author role', MAIN_ROLE_ENUM)
      },
      required: [true, FIELD_CANNOT_BE_EMPTY('author role')]
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: USER,
      required: [true, FIELD_CANNOT_BE_EMPTY('author')]
    },
    status: {
      type: String,
      enum: {
        values: OFFER_STATUS_ENUM,
        message: ENUM_CAN_BE_ONE_OF('offer status', OFFER_STATUS_ENUM)
      },
      default: OFFER_STATUS_ENUM[0]
    },
    FAQ: {
      type: [
        {
          question: {
            type: String,
            trim: true,
            required: [true, FIELD_CANNOT_BE_EMPTY('question')]
          },
          answer: {
            type: String,
            trim: true,
            required: [true, FIELD_CANNOT_BE_EMPTY('answer')]
          }
        }
      ]
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: CATEGORY,
      required: [true, FIELD_CANNOT_BE_EMPTY('category')]
    },
    subject: {
      type: Schema.Types.ObjectId,
      ref: SUBJECT,
      required: [true, FIELD_CANNOT_BE_EMPTY('subject')]
    }
  },
  {
    timestamps: true,
    versionKey: false,
    id: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
)

module.exports = model(OFFER, offerSchema)
