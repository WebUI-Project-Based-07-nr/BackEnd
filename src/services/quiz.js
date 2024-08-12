const Quiz = require('~/models/quiz')

const quizService = {
  getQuizzes: async () => {
    return await Quiz.find()
  },

  getQuizById: async (id) => {
    return await Quiz.findById(id).lean().exec()
  }
}

module.exports = quizService
