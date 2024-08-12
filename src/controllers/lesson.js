const lessonService = require('~/services/lesson')

const getLessons = async (req, res) => {
  const lessons = await lessonService.getLessons()
  res.status(200).json(lessons)
}

const getLessonByID = async (req, res) => {
  const { id } = req.params

  const lesson = await lessonService.getLessonById(id)

  res.status(200).json(lesson)
}

const createLesson = async (req, res) => {
  const lessonData = req.body

  const newLesson = await lessonService.createLesson(lessonData)

  res.status(201).json({
    status: 'success',
    data: newLesson
  })
}

const updateLesson = async (req, res) => {
  const { id } = req.params
  const updateData = req.body

  await lessonService.updateLesson(updateData, id)

  res.status(204).end()
}

const deleteLesson = async (req, res) => {
  const { id } = req.params

  await lessonService.deleteLesson(id)

  res.status(204).end()
}

module.exports = {
  getLessons,
  getLessonByID,
  createLesson,
  updateLesson,
  deleteLesson
}
