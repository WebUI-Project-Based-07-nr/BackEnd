const Quiz = require('~/models/quiz')
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
  }
}

module.exports = quizService
