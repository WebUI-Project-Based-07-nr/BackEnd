const mongoose = require('mongoose')
const questionService = require('~/services/question')
const userService = require('~/services/user')
const dbHandler = require('~/test/dbHandler')
const { createForbiddenError } = require('~/utils/errorsHelper')
const resourcesCategorySchema = require('~/models/resourcesCategory').schema

const createUser = async (userData) => {
  return await userService.createUser(
    userData.role,
    userData.firstName,
    userData.lastName,
    userData.email,
    userData.password,
    userData.appLanguage,
    userData.isEmailConfirmed
  )
}

const createCategory = async (authorId) => {
  const Category = mongoose.model('ResourcesCategory', resourcesCategorySchema)
  return await Category.create({ name: 'Sample Category', author: authorId })
}

describe('Question service', () => {
  beforeAll(async () => {
    await dbHandler.connect()
    mongoose.model('ResourcesCategory', resourcesCategorySchema)
  })

  afterAll(async () => await dbHandler.closeDatabase())

  afterEach(async () => await dbHandler.clearDatabase())

  const userData = {
    role: 'student',
    firstName: 'test',
    lastName: 'test',
    email: 'test.test@example.com',
    password: 'password123',
    appLanguage: 'en',
    isEmailConfirmed: false
  }

  const questionData = {
    title: 'Sample Question',
    text: 'This is a sample question',
    answers: [{ text: 'Answer 1' }, { text: 'Answer 2' }],
    type: 'multipleChoice',
    category: null
  }

  test('should create and fetch questions', async () => {
    const user = await createUser(userData)
    const category = await createCategory(user._id)
    questionData.category = category._id

    await questionService.createQuestion(user._id, questionData)
    const { items, count } = await questionService.getQuestions({}, {}, 0, 10)

    expect(count).toBe(1)
    expect(items).toHaveLength(1)
    expect(items[0].title).toBe(questionData.title)
    expect(items[0].category._id.toString()).toBe(category._id.toString())
  })

  test('should fetch question by ID', async () => {
    const user = await createUser(userData)
    const category = await createCategory(user._id)
    questionData.category = category._id

    const createdQuestion = await questionService.createQuestion(user._id, questionData)

    const fetchedQuestion = await questionService.getQuestionById(createdQuestion._id)

    expect(fetchedQuestion).not.toBeNull()
    expect(fetchedQuestion.title).toBe(questionData.title)
  })

  test('should return null for non-existing question by ID', async () => {
    const nonExistingId = mongoose.Types.ObjectId()

    const fetchedQuestion = await questionService.getQuestionById(nonExistingId)

    expect(fetchedQuestion).toBeNull()
  })

  test('should update question', async () => {
    const user = await createUser(userData)
    const category = await createCategory(user._id)
    questionData.category = category._id

    const createdQuestion = await questionService.createQuestion(user._id, questionData)

    const updateData = { title: 'Updated Question' }

    await questionService.updateQuestion(createdQuestion._id, user._id.toString(), updateData)

    const updatedQuestion = await questionService.getQuestionById(createdQuestion._id)
    expect(updatedQuestion.title).toBe('Updated Question')
  })

  test('should throw error for update on non-author question', async () => {
    const user1 = await createUser(userData)
    const user2 = await createUser({ ...userData, email: 'another@example.com' })
    const createdQuestion = await questionService.createQuestion(user1._id, questionData)

    await expect(
      questionService.updateQuestion(createdQuestion._id, user2._id.toString(), { title: 'Updated Question' })
    ).rejects.toThrowError(createForbiddenError().message)
  })

  test('should delete question', async () => {
    const user = await createUser(userData)
    const createdQuestion = await questionService.createQuestion(user._id, questionData)

    await questionService.deleteQuestion(createdQuestion._id, user._id.toString())

    const deletedQuestion = await questionService.getQuestionById(createdQuestion._id)
    expect(deletedQuestion).toBeNull()
  })

  test('should throw error for delete on non-author question', async () => {
    const user1 = await createUser(userData)
    const user2 = await createUser({ ...userData, email: 'another@example.com' })
    const createdQuestion = await questionService.createQuestion(user1._id, questionData)

    await expect(questionService.deleteQuestion(createdQuestion._id, user2._id.toString())).rejects.toThrowError(
      createForbiddenError().message
    )
  })
})
