const mongoose = require('mongoose')

const User = require('~/models/user')
const userService = require('~/services/user')
const dbHandler = require('~/test/dbHandler')

const { DOCUMENT_NOT_FOUND } = require('~/consts/errors')
const { createError } = require('~/utils/errorsHelper')

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

describe('User service', () => {
  beforeAll(async () => await dbHandler.connect())

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

  test('should create and fetch users', async () => {
    await createUser(userData)

    const { items, count } = await userService.getUsers({ match: {}, sort: {}, skip: 0, limit: 10 })

    expect(count).toBe(1)
    expect(items).toHaveLength(1)
    expect(items[0].email).toBe(userData.email)
  })

  test('should fetch user by ID', async () => {
    const userDataWIthOtherMail = { ...userData, email: 'usermail@mail.com' }
    const createdUser = await createUser(userDataWIthOtherMail)

    const fetchedUser = await userService.getUserById(createdUser._id)

    expect(fetchedUser).not.toBeNull()
    expect(fetchedUser.email).toBe('usermail@mail.com')
  })

  test('should return null for non-existing user by ID', async () => {
    const nonExistingId = mongoose.Types.ObjectId()

    const fetchedUser = await userService.getUserById(nonExistingId)

    expect(fetchedUser).toBeNull()
  })

  test('should fetch user by email', async () => {
    await createUser(userData)

    const fetchedUser = await userService.getUserByEmail(userData.email)

    expect(fetchedUser).not.toBeNull()
    expect(fetchedUser.email).toBe(userData.email)
  })

  test('should return null for non-existing user by email', async () => {
    const fetchedUser = await userService.getUserByEmail('somemail@example.com')
    expect(fetchedUser).toBe(null)
  })

  test('should update user privately', async () => {
    const createdUser = await createUser(userData)

    const updateData = { firstName: 'updatedName' }

    await userService.privateUpdateUser(createdUser._id, updateData)

    const updatedUser = await userService.getUserById(createdUser._id)
    expect(updatedUser.firstName).toBe('updatedName')
  })

  test('should throw error for private update on non-existing user', async () => {
    const nonExistingId = mongoose.Types.ObjectId()

    await expect(userService.privateUpdateUser(nonExistingId, { firstName: 'updatedName' })).rejects.toThrowError(
      'User with the specified ID was not found.'
    )
  })

  test('should update user with allowed fields', async () => {
    const createdUser = await createUser(userData)

    const updateData = {
      firstName: 'updatedName',
      lastName: 'updatedLastName'
    }

    await userService.updateUser(createdUser._id, 'student', updateData)

    const updatedUser = await userService.getUserById(createdUser._id)
    expect(updatedUser.firstName).toBe('updatedName')
    expect(updatedUser.lastName).toBe('updatedLastName')
  })

  test('should throw error for update on non-existing user', async () => {
    const nonExistingId = mongoose.Types.ObjectId()

    await expect(userService.updateUser(nonExistingId, 'student', { firstName: 'updatedName' })).rejects.toThrowError(
      'User with the specified ID was not found.'
    )
  })

  test('should update user status', async () => {
    const createdUser = await createUser(userData)

    const updateStatus = { student: 'inactive' }

    await userService.updateStatus(createdUser._id, updateStatus)

    const updatedUser = await userService.getUserById(createdUser._id)
    expect(updatedUser.status.student).toBe('inactive')
  })

  test('should throw error for status update on non-existing user', async () => {
    const nonExistingId = mongoose.Types.ObjectId()

    await expect(userService.updateStatus(nonExistingId, { student: 'inactive' })).rejects.toThrowError(
      'User with the specified ID was not found.'
    )
  })

  test('should delete user', async () => {
    const createdUser = await createUser(userData)

    await userService.deleteUser(createdUser._id)

    const deletedUser = await userService.getUserById(createdUser._id)
    expect(deletedUser).toBeNull()
  })
  test('should throw error for duplicate email during user creation', async () => {
    await createUser(userData)

    await expect(createUser(userData)).rejects.toThrowError('User with the specified email already exists.')
  })

  test('should update user with allowed fields only', async () => {
    const createdUser = await createUser(userData)

    const updateData = {
      firstName: 'UpdatedName',
      lastName: 'UpdatedLastName',
      invalidField: 'Should not be allowed'
    }

    await userService.updateUser(createdUser._id, 'student', updateData)

    const updatedUser = await userService.getUserById(createdUser._id)
    expect(updatedUser.firstName).toBe('UpdatedName')
    expect(updatedUser.lastName).toBe('UpdatedLastName')
    expect(updatedUser.invalidField).toBeUndefined()
  })

  test('should delete user and return null when fetching deleted user', async () => {
    const createdUser = await createUser(userData)

    await userService.deleteUser(createdUser._id)

    const deletedUser = await userService.getUserById(createdUser._id)
    expect(deletedUser).toBeNull()
  })

  test('should handle updating user status for different roles', async () => {
    const createdUser = await createUser(userData)

    const updateStatus = { student: 'inactive', tutor: 'active' }

    await userService.updateStatus(createdUser._id, updateStatus)

    const updatedUser = await userService.getUserById(createdUser._id)
    expect(updatedUser.status.student).toBe('inactive')
    expect(updatedUser.status.tutor).toBe('active')
  })
})
