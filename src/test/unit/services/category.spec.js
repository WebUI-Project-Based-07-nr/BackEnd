const Category = require('~/models/category')
const categoryService = require('~/services/category')
const { DOCUMENT_ALREADY_EXISTS } = require('~/consts/errors')

jest.mock('~/models/category')

describe('Category service', () => {
    afterEach(() => {
        jest.clearAllMocks()
    })

    describe('Fetching Categories', () => {
        test('Should return aggregated categories', async () => {
            const mockPipeline = [
                { $match: { name: 'Test' } },
                { $sort: { name: 1 } }
            ]
            const mockResult = [{ '_id': '123', name: 'Test Category' }]

            Category.aggregate.mockReturnValue({
                exec: jest.fn().mockResolvedValueOnce([mockResult])
            })

            const result = await categoryService.getCategories(mockPipeline)

            expect(Category.aggregate).toHaveBeenCalledWith(mockPipeline)
            expect(result).toEqual(mockResult)
        })

        test('Should return an empty array when no categories match', async () => {
            const mockPipeline = [{ $match: { name: 'Dummy' } }]

            Category.aggregate.mockReturnValue({
                exec: jest.fn().mockResolvedValue([[]])
            })

            const result = await categoryService.getCategories(mockPipeline)

            expect(Category.aggregate).toHaveBeenCalledWith(mockPipeline)
            expect(result).toEqual([])
        })

        test('Should correctly process a complex pipeline', async () => {
            const mockPipeline = [
                { $match: { name: { $regex: /test/i } } },
                { $lookup: { from: 'subjects', localField: '_id', foreignField: 'category', as: 'subjects' } },
                { $sort: { name: 1 } }
            ]
            const mockResult = [{ '_id': '123', name: 'Test Category', subjects: [] }]

            Category.aggregate.mockReturnValue({
                exec: jest.fn().mockResolvedValueOnce([mockResult])
            })

            const result = await categoryService.getCategories(mockPipeline)

            expect(Category.aggregate).toHaveBeenCalledWith(mockPipeline)
            expect(result).toEqual(mockResult)
        })
    })

    describe('Creating Categories', () => {
        const mockCategoryData = {
            name: 'Mathematics',
            appearance: {
                icon: 'mock-icon-path',
                color: 'mock-color'
            }
        }

        test('Should create and return a new category', async () => {
            Category.findOne = jest.fn().mockResolvedValue(null)
            Category.prototype.save = jest.fn().mockResolvedValue(mockCategoryData)

            const category = await categoryService.createCategory(mockCategoryData)

            expect(category).toEqual(mockCategoryData)
            expect(Category.findOne).toHaveBeenCalledWith({ name: 'Mathematics' })
            expect(Category.prototype.save).toHaveBeenCalled()
        })

        test('Should throw an error if category already exists', async () => {
            Category.findOne = jest.fn().mockResolvedValue(mockCategoryData)

            await expect(categoryService.createCategory(mockCategoryData))
                .rejects.toThrow(DOCUMENT_ALREADY_EXISTS('name'))
        })

        test('Should reject with missing fields', async () => {
            const incompleteData = {
                name: 'Mathematics',
                appearance: {
                    icon: 'mock-icon-path'
                }
            }

            await expect(categoryService.createCategory({ ...incompleteData }))
                .rejects.toThrow('The request could not be processed due to invalid or missing parameters.')
        })
    })
})
