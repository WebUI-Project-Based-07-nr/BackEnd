const Quiz = require('~/models/quiz')
const quizService = require('~/services/quiz')
const { createError } = require('~/utils/errorsHelper')
const { allowedQuizFieldsForUpdate } = require('~/validation/services/quiz')
const filterAllowedFields = require('~/utils/filterAllowedFields')
const errors = require('~/consts/errors')

jest.mock('~/models/quiz')
jest.mock('~/utils/errorsHelper')
jest.mock('~/utils/filterAllowedFields')

describe('Quiz service', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  describe('Get Quizzes', () => {
    test('Should return quizzes successfully', async () => {
      const mockQuizzes = [
        { _id: '1', title: 'QuizSpec 1' },
        { _id: '2', title: 'QuizSpec 2' }
      ]

      Quiz.find.mockResolvedValue(mockQuizzes)

      const quizzes = await quizService.getQuizzes()

      expect(quizzes).toEqual(mockQuizzes)
    })

    test('Should return empty array if there are no quizzes', async() => {
      Quiz.find.mockResolvedValue([])

      const quizzes = await quizService.getQuizzes()

      expect(quizzes).toEqual([])
    })
  })

  describe('Get Quiz by ID', () => {
    test('Should return a quiz by id', async () => {
      const mockQuiz = { id: 'mock-quiz-id', title: 'Quiz' }

      Quiz.findById.mockReturnValue({
        lean: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(mockQuiz)
      })

      const quiz = await quizService.getQuizById(mockQuiz.id)

      expect(Quiz.findById).toHaveBeenCalledWith(mockQuiz.id)
      expect(quiz).toEqual(mockQuiz)
    })

    test('Should return null if no quiz is found', async () => {
      Quiz.findById.mockReturnValue({
        lean: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(null)
      })

      const quiz = await quizService.getQuizById('id')

      expect(Quiz.findById).toHaveBeenCalledWith('id')
      expect(quiz).toEqual(null)
    })
  })

  describe('Create Quiz', () => {
    test('Should create a quiz', async () => {
      const mockQuizData = { title: 'Quiz Creation', description: 'Testing creation' }

      Quiz.findOne.mockResolvedValue(null)
      Quiz.create.mockResolvedValue(mockQuizData)

      const createdQuiz = await quizService.createQuiz(mockQuizData)

      expect(Quiz.findOne).toHaveBeenCalledWith({ title: mockQuizData.title })
      expect(Quiz.create).toHaveBeenCalledWith(mockQuizData)
      expect(createdQuiz).toEqual(mockQuizData)
    })

    test('Should throw an error if there is a duplicate quiz', async () => {
      const mockQuizData = { title: 'Quiz Creation', description: 'Testing creation' }
      const mockQuiz = { id: 'creation', ...mockQuizData }

      Quiz.findOne.mockResolvedValue(mockQuiz)

      await expect(quizService.createQuiz(mockQuizData))
        .rejects
        .toEqual(createError(403, errors.DUPLICATE_QUIZ))

      expect(Quiz.findOne).toHaveBeenCalledWith({ title: mockQuizData.title })
      expect(Quiz.create).not.toHaveBeenCalled()
    })
  })

  describe('Update Quiz', () => {
    test('Should update quiz', async () => {
      const mockQuiz = {
        id: 'quiz-id',
        title: 'Initial Quiz',
        description: 'initial quiz',
        save: jest.fn().mockImplementation(function() { return this }),
        validate: jest.fn().mockImplementation(function() { return this })
      }
      const updateData = { title: 'Updated Quiz', description: 'updated quiz' }
      const filterData = { title: 'Updated Quiz', description: 'updated quiz' }

      Quiz.findById.mockResolvedValue(mockQuiz)
      filterAllowedFields.mockReturnValue(filterData)

      await quizService.updateQuiz(updateData, mockQuiz.id)
      expect(Quiz.findById).toHaveBeenCalledWith(mockQuiz.id)
      expect(filterAllowedFields).toHaveBeenCalledWith(updateData, allowedQuizFieldsForUpdate)
      expect(mockQuiz.title).toEqual(updateData.title)
      expect(mockQuiz.description).toEqual(updateData.description)
      expect(mockQuiz.validate).toHaveBeenCalled()
      expect(mockQuiz.save).toHaveBeenCalled()
    })

    test('Should throw an error if quiz is not found', async () => {
      Quiz.findById.mockResolvedValue(null)

      await expect(quizService.updateQuiz({ title: 'New title' }, 'non-existent-id'))
        .rejects
        .toThrow(createError(404, errors.NOT_FOUND))

      expect(Quiz.findById).toHaveBeenCalledWith('non-existent-id')
    })
  })

  describe('Delete Quiz', () => {
    test('Should delete a quiz by id', async () => {
      Quiz.findByIdAndRemove.mockReturnValue({
        exec: jest.fn().mockResolvedValue({})
      })

      await quizService.deleteQuiz('1')

      expect(Quiz.findByIdAndRemove).toHaveBeenCalledWith('1')
    })

    test('Should return null if the quiz is not found', async () => {
      Quiz.findByIdAndRemove.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null)
      })

      const result = await quizService.deleteQuiz('non-existent-id')

      expect(result).toBeNull()
      expect(Quiz.findByIdAndRemove).toHaveBeenCalledWith('non-existent-id')
    })
  })
})
