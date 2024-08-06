const Category = require('~/models/category')
const categoryService = require('~/services/category')

jest.mock('~/models/category')

describe('Category service', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  test('Should return aggregated categories', async () => {
    const mockPipeline = [
      {
        $match: { name: 'Test' }
      },
      {
        $sort: { name: 1 }
      }
    ]

    const mockResult = [
      { '_id': '123', name: 'Test Category' }
    ]

    Category.aggregate.mockReturnValue({
      exec: jest.fn().mockResolvedValueOnce([mockResult])
    })

    const result = await categoryService.getCategories(mockPipeline)

    expect(Category.aggregate).toHaveBeenCalledWith(mockPipeline)
    expect(result).toEqual(mockResult)
  })

  test('Should return an empty array when no categories match', async () => {
    const mockPipeline = [
      {
        $match: { name: 'Dummy' }
      }
    ]

    Category.aggregate.mockReturnValue({
      exec: jest.fn().mockResolvedValue([[]])
    })

    const result = await categoryService.getCategories(mockPipeline)

    expect(Category.aggregate).toHaveBeenCalledWith(mockPipeline)
    expect(result).toEqual([])
  })

  test('Should correctly process a complex pipeline', async () => {
    const mockPipeline = [
      {
        $match: { name: { $regex: /test/i } }
      },
      {
        $lookup: {
          from: 'subjects',
          localField: '_id',
          foreignField: 'category',
          as: 'subjects'
        }
      },
      {
        $sort: { name: 1 }
      }
    ]

    const mockResult = [
      { '_id': '123', name: 'Test Category', subjects: [] }
    ]

    Category.aggregate.mockReturnValue({
      exec: jest.fn().mockResolvedValueOnce([mockResult])
    })

    const result = await categoryService.getCategories(mockPipeline)

    expect(Category.aggregate).toHaveBeenCalledWith(mockPipeline)
    expect(result).toEqual(mockResult)
  })
})
