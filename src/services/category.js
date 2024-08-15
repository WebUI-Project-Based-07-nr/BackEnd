const Category = require('~/models/category')
const Subject = require('~/models/subject')
const { createError } = require('~/utils/errorsHelper')
const { DOCUMENT_ALREADY_EXISTS, BAD_REQUEST } = require('~/consts/errors')


const categoryService = {
    getCategories: async (pipeline) => {
        const [response] = await Category.aggregate(pipeline).exec()
        return response
    },
      
    createCategory: async ({ name, appearance }) => {
        if (!name || !appearance.icon || !appearance.color) {
          throw createError(400, BAD_REQUEST)
        }

        const existingCategory = await Category.findOne({ name })
        if (existingCategory) {
            throw createError(409, DOCUMENT_ALREADY_EXISTS('name'))
        }
        
        const category = new Category({ name, appearance })
        return await category.save()
    },

    getSubjectNamesById: async (categoryId) => {
        const subjects = await Subject.find({ categoryId }).select('name -_id')
        return subjects.map(subject => subject.name)
    }
}

module.exports = categoryService
