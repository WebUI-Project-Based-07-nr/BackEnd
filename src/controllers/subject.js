const subjectService = require('~/services/subject')
const { createError } = require('~/utils/errorsHelper')
const { BAD_REQUEST } = require('~/consts/errors')

const getSubjects = async (req, res, next) => {
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
    next(error)
  }
}

module.exports = {
  getSubjects
}
