const Lesson = require('~/models/lesson')
const Category = require('~/models/category')
const User = require('~/models/user')
const filterAllowedFields = require('~/utils/filterAllowedFields')
const { allowedLessonFieldsForUpdate } = require('~/validation/services/lesson')
const { createError } = require('~/utils/errorsHelper')
const errors = require('~/consts/errors')

const lessonService = {
  getLessons: async () => {
    return await Lesson.find()
  },

  getLessonById: async (lessonId) => {
    return await Lesson.findById(lessonId)
  },

  createLesson: async (lessonData) => {
    const duplicateLesson = await Lesson.findOne({
      title: lessonData.title,
      author: lessonData.author,
      category: lessonData.category,
    })
    if (duplicateLesson) {
      throw createError(403, errors.DUPLICATE_LESSON)
    }

    const existingAuthor = await User.findById(lessonData.author)
    if (!existingAuthor) {
      throw createError(404, errors.AUTHOR_NOT_FOUND)
    }

    if (!existingAuthor.role.includes('tutor')) {
      throw createError(403, errors.FIELD_IS_NOT_OF_PROPER_ENUM_VALUE('role', ['tutor']))
    }

    const existingCategory = await Category.findById(lessonData.category)
    if (!existingCategory) {
      throw createError(404, errors.DOCUMENT_NOT_FOUND('Category'))
    }

    const newLesson = new Lesson(lessonData)
    return await newLesson.save()
  },

  updateLesson: async (updateData, lessonId) => {
    const filteredUpdateData = filterAllowedFields(updateData, allowedLessonFieldsForUpdate)

    const lesson = await Lesson.findById(lessonId)

    for (let field in filteredUpdateData) {
      lesson[field] = filteredUpdateData[field]
    }

    await lesson.validate()
    await lesson.save()
  },

  deleteLesson: async (lessonId) => {
    await Lesson.findByIdAndRemove(lessonId).exec()
  }
}

module.exports = lessonService
