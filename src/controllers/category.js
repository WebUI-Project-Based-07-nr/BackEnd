const categoryService = require('~/services/category')
const categoryAggregateOptions = require('~/utils/categories/categoriesAggregateOptions')

const getCategories = async (req, res) => {
  const pipeline = categoryAggregateOptions(req.query)

  const offers = await categoryService.getCategories(pipeline)

  res.status(200).json(offers)
}

module.exports = {
  getCategories
}
