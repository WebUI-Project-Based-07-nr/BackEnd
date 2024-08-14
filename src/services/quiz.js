const Quiz = require('~/models/quiz')
const filterAllowedFields = require('~/utils/filterAllowedFields')
const { allowedQuizFieldsForUpdate } = require('~/validation/services/quiz')
const { createError } = require('~/utils/errorsHelper')
const errors = require('~/consts/errors')

const quizService = {
  getQuizzes: async () => {
    return await Quiz.find()
  },

  getQuizById: async (id) => {
    return await Quiz.findById(id).lean().exec()
  },

  createQuiz: async (quizData) => {
    const duplicateQuiz = await Quiz.findOne({ title: quizData.title })
    if (duplicateQuiz) {
      throw createError(403, errors.DUPLICATE_QUIZ)
    }

    return Quiz.create(quizData)
  },

  updateQuiz: async (updateData, id) => {
    const filteredUpdatedData = filterAllowedFields(updateData, allowedQuizFieldsForUpdate)

    const quiz = await Quiz.findById(id)

    for (let field in filteredUpdatedData) {
      quiz[field] = filteredUpdatedData[field]
    }

    await quiz.validate()
    await quiz.save()
  },

  deleteQuiz: async (id) => {
    return Quiz.findByIdAndRemove(id).exec()
  }
}

module.exports = quizService
