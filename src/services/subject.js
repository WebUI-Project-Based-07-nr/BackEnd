const { createError } = require('~/utils/errorsHelper')
const { DOCUMENT_ALREADY_EXISTS, BAD_REQUEST, NOT_FOUND } = require('~/consts/errors')

const Category = require('~/models/category')
const Subject = require('~/models/subject')

const subjectService = {
  getSubjects: async (pipeline) => {
    const response = await Subject.aggregate(pipeline).exec()
    return response
  },

  createSubject: async ({ name, categoryId }) => {
    if (!name || !categoryId) {
      throw createError(400, BAD_REQUEST)
    }

    const existingSubject = await Subject.findOne({ name })
    if (existingSubject) {
      throw createError(409, DOCUMENT_ALREADY_EXISTS('name'))
    }

    const categoryExists = await Category.findById(categoryId)
    if (!categoryExists) {
      throw createError(404, NOT_FOUND('Category'))
    }

    const subject = new Subject({ name, category: categoryId })
    return await subject.save()
  },

  updateSubject: async (subjectId, updateData) => {
    const subject = await Subject.findById(subjectId)
    if (!subject) {
      throw createError(404, NOT_FOUND('Subject'))
    }

    if (updateData.category) {
      const categoryExists = await Category.findById(updateData.category)
      if (!categoryExists) {
        throw createError(404, NOT_FOUND('Category'))
      }
    }

    Object.assign(subject, updateData)
    return await subject.save()
  },

  deleteSubject: async (subjectId) => {
    const subject = await Subject.findById(subjectId)
    if (!subject) {
      throw createError(404, NOT_FOUND('Subject'))
    }

    await subject.remove()
    return { message: 'Subject deleted successfully' }
  }
}

module.exports = subjectService
