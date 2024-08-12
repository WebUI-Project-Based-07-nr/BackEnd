const quizService = require('~/services/quiz')

const getQuizzes = async (req, res) => {
  const quizzes = await quizService.getQuizzes()
  res.status(200).json(quizzes)
}

module.exports = {
  getQuizzes
}
