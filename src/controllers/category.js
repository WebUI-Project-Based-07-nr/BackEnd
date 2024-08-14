const categoryService = require('~/services/category')
const categoryAggregateOptions = require('~/utils/categories/categoriesAggregateOptions')
const { INTERNAL_SERVER_ERROR } = require('~/consts/errors')
const { createError } = require('~/utils/errorsHelper')

const getCategories = async (req, res) => {
  const pipeline = categoryAggregateOptions(req.query)

  const offers = await categoryService.getCategories(pipeline)

  res.status(200).json(offers)
}

const getCategoryById = async (req, res) => {
  const { id } = req.params

  const category = await categoryService.getCategoryById(id)

  res.status(200).json(category)
}

const createCategory = async (req, res) => {
    const categoryData = req.body

    try {
        const newCategory = await categoryService.createCategory({ ...categoryData })
        res.status(201).json(newCategory)
    } catch (error) {
        if (error.code && error.message) {
            throw error
        }

        throw createError(500, INTERNAL_SERVER_ERROR)
    }
}

const deleteCategory = async (req, res) => {
  const { id } = req.params

  await categoryService.deleteCategory(id)

  res.status(204).end()
}

module.exports = {
    getCategories,
    getCategoryById,
    createCategory,
    deleteCategory
}
