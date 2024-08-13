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

const createQuiz = async (req, res) => {
  const quizData = req.body

  const newQuiz = await quizService.createQuiz(quizData)

  res.status(201).json({
    status: 'success',
    data: newQuiz
  })
}

const updateQuiz = async (req, res) => {
  const { id } = req.params
  const updateData = req.body

  await quizService.updateQuiz(updateData, id)

  res.status(204).end()
}

const deleteQuiz = async (req, res) => {
  const { id } = req.params

  await quizService.deleteQuiz(id)

  res.status(204).end()
}

module.exports = {
  getQuizzes,
  getQuizById,
  createQuiz,
  updateQuiz,
  deleteQuiz
}
