const Category = require('~/models/category')

const categoryService = {
  getCategories: async (pipeline) => {
    const [response] = await Category.aggregate(pipeline).exec()
    return response
  }
}

module.exports = categoryService
