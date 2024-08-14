const ObjectId = require('mongodb').ObjectId

const subjectsAggregateOptions = (query) => {
  const { category, limit = 100, skip = 0 } = query

  const filter = {}
  if (category) {
    filter.category = new ObjectId(category)
  }

  return [
    {
      $match: filter
    },
    {
      $lookup: {
        from: 'offers',
        localField: '_id',
        foreignField: 'subject',
        as: 'offers'
      }
    },
    {
      $addFields: {
        totalOffers: { $size: '$offers' }
      }
    },
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
    },
    {
      $skip: parseInt(skip)
    },
    {
      $limit: parseInt(limit)
    }
  ]
}

module.exports = subjectsAggregateOptions
