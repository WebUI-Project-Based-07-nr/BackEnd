const { Schema, model } = require('mongoose')

const { SUBJECT, CATEGORY } = require('~/consts/models')
const { FIELD_CANNOT_BE_EMPTY } = require('~/consts/errors')

const subjectSchema = new Schema({
    name: {
        type: String,
        required: [true, FIELD_CANNOT_BE_EMPTY('name')],
        unique: true
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: CATEGORY,
        required: [true, FIELD_CANNOT_BE_EMPTY('category')]
    }
})

module.exports = model(SUBJECT, subjectSchema)
