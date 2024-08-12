const Quiz = require('~/models/quiz')

const quizService = {
  getQuizzes: async () => {
    return await Quiz.find()
  }
}

module.exports = quizService
