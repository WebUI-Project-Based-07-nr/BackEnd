const Quiz = require('~/models/quiz')
const quizService = require('~/services/quiz')
const { serverInit, serverCleanup, stopServer } = require('~/test/setup')
const { createError } = require('~/utils/errorsHelper')
const errors = require('~/consts/errors')
const mongoose = require('mongoose')

jest.mock('~/services/quiz')
jest.mock('~/models/quiz')

describe('Quiz controller', () => {
  let app, server

  beforeAll(async () => {
    ;({ app, server } = await serverInit())
  })

  afterEach(async () => {
    await serverCleanup()
    jest.resetAllMocks()
  })

  afterAll(async () => {
    await stopServer(server)
  })

  describe('GET /quizzes', () => {
    test('Should fetch all quizzes', async () => {
      const mockQuizzes = [{ id: '1', title: 'Quiz 1' }, { id: '2', title: 'Quiz 2' }]
      quizService.getQuizzes.mockResolvedValue(mockQuizzes)

      const res = await app
        .get('/quizzes')
        .expect(200)

      expect(quizService.getQuizzes).toHaveBeenCalledTimes(1)
      expect(res.body).toEqual(mockQuizzes)
    })
  })

  describe('GET /quizzes/:id', () => {
    test('Should fetch quiz by ID', async () => {
      const id = new mongoose.Types.ObjectId().toString()
      const mockQuiz = { id: id, title: 'Quiz 1' }

      Quiz.findById.mockResolvedValue(mockQuiz)
      quizService.getQuizById.mockResolvedValue(mockQuiz)

      const response = await app
        .get(`/quizzes/${id}`)
        .expect(200)

      expect(quizService.getQuizById).toHaveBeenCalledTimes(1)
      expect(response.body).toEqual(mockQuiz)
    })

    test('Should throw an error if quiz is not found', async () => {
      const id = new mongoose.Types.ObjectId().toString()
      const error404 = createError(404, errors.DOCUMENT_NOT_FOUND('Quiz'))

      quizService.getQuizById.mockResolvedValue(null)
      Quiz.findById.mockResolvedValue(null)

      const response = await app
        .get(`/quizzes/${id}`)
        .expect(404)

      expect(Quiz.findById).toHaveBeenCalledWith(id)
      expect(response.body).toEqual({
        message: 'Quiz with the specified ID was not found.',
        ...error404
      })
    })
  })

  describe('POST /quizzes', () => {
    test('Should create a new quiz', async () => {
      const mockQuiz = { _id: '1', title: 'New Quiz', description: 'A new quiz' }
      const quizData = { title: 'New Quiz', description: 'A new quiz' }

      quizService.createQuiz.mockResolvedValue(mockQuiz)

      const response = await app
        .post('/quizzes')
        .send(quizData)
        .expect(201)

      expect(quizService.createQuiz).toHaveBeenCalledWith(quizData)
      expect(response.body).toEqual({
        status: 'success',
        data: mockQuiz,
      })
    })
  })

  describe('PATCH /quizzes/:id', () => {
    test('Should update an existing quiz', async () => {
      const id = new mongoose.Types.ObjectId().toString()
      const updateData = { title: 'Updated Quiz', description: 'Updated description' }

      Quiz.findById.mockResolvedValue({ _id: id, title: 'Old Quiz', description: 'Old description' })
      quizService.updateQuiz.mockResolvedValue()

      const response = await app
        .patch(`/quizzes/${id}`)
        .send(updateData)
        .expect(204)

      expect(quizService.updateQuiz).toHaveBeenCalledWith(updateData, id)
      expect(response.body).toEqual({})
    })

    test('Should return 404 if quiz is not found', async () => {
      const error404 = createError(404, errors.DOCUMENT_NOT_FOUND('Quiz'))
      const id = new mongoose.Types.ObjectId().toString()
      const updateData = { title: 'Updated Quiz', description: 'Updated description' }

      Quiz.findById.mockResolvedValue(null)

      const response = await app
        .patch(`/quizzes/${id}`)
        .send(updateData)
        .expect(404)

      expect(response.body).toEqual({
        message: 'Quiz with the specified ID was not found.',
        ...error404
      })
    })
  })

  describe('DELETE /quizzes/:id', () => {
    test('Should delete a quiz by ID', async () => {
      const id = new mongoose.Types.ObjectId().toString()
      const mockQuiz = { id: id, title: 'Quiz to delete' }

      Quiz.findById.mockResolvedValue(mockQuiz)
      Quiz.findByIdAndRemove.mockResolvedValue(mockQuiz)

      const response = await app
        .delete(`/quizzes/${id}`)
        .expect(204)

      expect(quizService.deleteQuiz).toHaveBeenCalledWith(id)
    })

    test('Should return 404 if quiz is not found', async () => {
      const error404 = createError(404, errors.DOCUMENT_NOT_FOUND('Quiz'))
      const id = new mongoose.Types.ObjectId().toString()

      Quiz.findByIdAndRemove.mockResolvedValue(null)

      const response = await app
        .delete(`/quizzes/${id}`)
        .expect(404)

      expect(response.body).toEqual({
        message: 'Quiz with the specified ID was not found.',
        ...error404
      })
    })
  })
})
