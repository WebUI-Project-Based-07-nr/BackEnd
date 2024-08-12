const quizService = require('~/services/quiz')

const getQuizzes = async (req, res) => {
  const quizzes = await quizService.getQuizzes()
  res.status(200).json(quizzes)
}

const getQuizById = async (req, res) => {
  const { id } = req.params

  const quiz = await quizService.getQuizById(id)

  res.status(200).json(quiz)
}

module.exports = {
  getQuizzes,
  getQuizById
}
