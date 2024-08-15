const subjectService = require('~/services/subject')
const { createError } = require('~/utils/errorsHelper')
const { BAD_REQUEST } = require('~/consts/errors')
const { INTERNAL_SERVER_ERROR } = require('~/consts/errors')

const subjectsAggregateOptions = require('~/utils/subjects/subjectsAggregateOptions')

const getSubjects = async (req, res) => {
  try {
    const pipeline = subjectsAggregateOptions(req.query)

    const subjects = await subjectService.getSubjects(pipeline)

    res.status(200).json({ success: true, items: subjects })
  } catch (error) {
    if (error.code && error.message) {
      throw error
    }
    throw createError(500, INTERNAL_SERVER_ERROR)
  }
}

const createSubject = async (req, res) => {
  try {
    const { name, categoryId } = req.body
    if (!name || !categoryId) {
      throw createError(400, BAD_REQUEST('Name and category ID are required'))
    }

    const subject = await subjectService.createSubject({ name, categoryId })

    res.status(201).json({ success: true, data: subject })
  } catch (error) {
    if (error.code && error.message) {
      throw error
      
    }
    throw createError(500, INTERNAL_SERVER_ERROR)
  }
}

const deleteSubject = async (req, res) => {
  const { id } = req.params

  await subjectService.deleteSubject(id)

  res.status(204).end()
}

module.exports = {
  getSubjects,
  createSubject,
  deleteSubject
}
