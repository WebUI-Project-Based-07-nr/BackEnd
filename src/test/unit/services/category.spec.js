const categoryService = require('~/services/category');
const Category = require('~/models/category')
const { DOCUMENT_ALREADY_EXISTS } = require('~/consts/errors')

jest.mock('~/models/category')

describe('Category service', () => {
    const mockCategoryData = {
        name: 'Mathematics',
        icon: 'mock-icon-path',
        color: 'mock-color'
    }

    test('Should create and return a new category', async () => {
        Category.findOne = jest.fn().mockResolvedValue(null)
        Category.prototype.save = jest.fn().mockResolvedValue(mockCategoryData)

        const category = await categoryService.createCategory(mockCategoryData)

        expect(category).toEqual(mockCategoryData)
        expect(Category.findOne).toHaveBeenCalledWith({ name: 'Mathematics' })
        expect(Category.prototype.save).toHaveBeenCalled()
    });

    test('Should throw an error if category already exists', async () => {
        Category.findOne = jest.fn().mockResolvedValue(mockCategoryData);

        await expect(categoryService.createCategory(mockCategoryData))
            .rejects.toThrow(DOCUMENT_ALREADY_EXISTS('name'))
    })

    test('Should reject with missing fields', async () => {
        const incompleteData = {
            name: 'Mathematics',
            icon: 'mock-icon-path',
        }

        await expect(categoryService.createCategory({ ...incompleteData }))
            .rejects.toThrow('The request could not be processed due to invalid or missing parameters.')
    })
})
