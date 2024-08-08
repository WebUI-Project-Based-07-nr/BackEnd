const Category = require('~/models/category')
const { createError } = require("~/utils/errorsHelper")
const { DOCUMENT_ALREADY_EXISTS, BAD_REQUEST } = require('~/consts/errors')


const categoryService = {
    getCategories: async (pipeline) => {
        const [response] = await Category.aggregate(pipeline).exec()
        return response
    },
      
    createCategory: async ({ name, icon, color }) => {
        if (!name || !icon || !color) {
            throw createError(400, BAD_REQUEST)
        }

        const existingCategory = await Category.findOne({ name })
        if (existingCategory) {
            throw createError(409, DOCUMENT_ALREADY_EXISTS('name'))
        }

        const category = new Category({ name, icon, color })
        return await category.save()
    }
}

module.exports = categoryService
