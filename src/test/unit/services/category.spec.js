const Category = require('~/models/category')
const Subject = require('~/models/subject')
const categoryService = require('~/services/category')
const { DOCUMENT_ALREADY_EXISTS } = require('~/consts/errors')
const mongoose = require('mongoose')
const { createError } = require('~/utils/errorsHelper')
const { BAD_REQUEST } = require('~/consts/errors')

jest.mock('~/models/category')
jest.mock('~/models/subject')

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

    describe('Fetching subject by category ID', () => {
        test('Should return subject for valid category id', async () => {
            const categoryId = new mongoose.Types.ObjectId()
            const mockSubjects = [{ name: 'Math' }, { name: 'Computer Science' }]

            Subject.find.mockReturnValue({
                select: jest.fn().mockResolvedValue(mockSubjects)
            });

            const result = await categoryService.getSubjectNamesById(categoryId)

            expect(Subject.find).toHaveBeenCalledWith({ categoryId })
            expect(result).toEqual(['Math', 'Computer Science'])
        })

        test('Should return an empty array if no subjects are found', async () => {
            const categoryId = new mongoose.Types.ObjectId()

            Subject.find.mockReturnValue({
                select: jest.fn().mockResolvedValue([])
            });

            const result = await categoryService.getSubjectNamesById(categoryId)

            expect(Subject.find).toHaveBeenCalledWith({ categoryId })
            expect(result).toEqual([])
        })

        test('Should throw BAD_REQUEST error if no id is provided', async () => {
            const error = createError(400, BAD_REQUEST)
            await expect(categoryService.getSubjectNamesById())
                .rejects
                .toEqual(error)
        })
    })
})
