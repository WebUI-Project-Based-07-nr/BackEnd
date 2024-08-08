const subjectService = require('~/services/subject')
const { createError } = require('~/utils/errorsHelper')
const { BAD_REQUEST } = require('~/consts/errors')
const { INTERNAL_SERVER_ERROR } = require('~/consts/errors')

const getSubjects = async (req, res) => {
  try {
    const { category, limit = 100, skip = 0 } = req.query

    if (isNaN(limit) || isNaN(skip)) {
      throw createError(400, BAD_REQUEST('Limit and skip must be numbers'))
    }

    const filter = {}
    if (category) {
      filter.category = category
    }

    const pipeline = [
      { $match: filter },
      { $skip: parseInt(skip) },
      { $limit: parseInt(limit) },
      {
        $lookup: {
          from: 'categories',
          localField: 'category',
          foreignField: '_id',
          as: 'category'
        }
      },
      {
        $unwind: {
          path: '$category',
          preserveNullAndEmptyArrays: true
        }
      }
    ]

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

module.exports = {
  getSubjects,
  createSubject
}
