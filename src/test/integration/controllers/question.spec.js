const request = require('supertest')
const express = require('express')
const bodyParser = require('body-parser')
const {
    getQuestions,
    getQuestionById,
    createQuestion,
    deleteQuestion,
    updateQuestion
} = require('~/controllers/question');
const questionService = require('~/services/question');
const getCategoriesOptions = require('~/utils/getCategoriesOption')
const getMatchOptions = require('~/utils/getMatchOptions')
const getSortOptions = require('~/utils/getSortOptions')
const { connect, closeDatabase, clearDatabase } = require('~/test/dbHandler')
const isEntityValid = require('~/middlewares/entityValidation')
const asyncWrapper = require('~/middlewares/asyncWrapper')
const Question = require('~/models/question')
const { FORBIDDEN } = require('~/consts/errors')
const { updateQuestionHandler } = require('~/test/helpers')

jest.mock('~/services/question')
jest.mock('~/utils/getCategoriesOption')
jest.mock('~/utils/getMatchOptions')
jest.mock('~/utils/getSortOptions')
jest.mock('~/utils/errorsHelper')
jest.mock('~/models/question', () => ({
    findById: jest.fn()
}))


const app = express()
app.use(bodyParser.json())
app.use((req, res, next) => {
    if (req.headers.user) {
        req.user = JSON.parse(req.headers.user);
    }
    next();
});

app.get('/', asyncWrapper(getQuestions))
app.get('/:id',
    isEntityValid({ params: [{ model: Question, idName: 'id' }] }),
    asyncWrapper(getQuestionById)
);
app.post('/questions',
    isEntityValid({ params: [{ model: Question, idName: 'id' }] }),
    asyncWrapper(createQuestion)
);
app.delete('/questions/:id',
    isEntityValid({ params: [{ model: Question, idName: 'id' }] }),
    asyncWrapper(deleteQuestion)
);
app.put('/questions/:id',
    isEntityValid({ params: [{ model: Question, idName: 'id' }] }),
    asyncWrapper(updateQuestion)
);

describe('Question controller', () => {
    beforeAll(async () => {
        await connect()
    })

    afterAll(async () => {
        await closeDatabase()
    })

    afterEach(async () => {
        await clearDatabase()
        jest.clearAllMocks()
    })

    const mockQuestions = {
        items: [
            {
                title: 'Question 1',
                text: 'What is the capital of France?',
                answers: [
                    { text: 'Paris', isCorrect: true },
                    { text: 'London', isCorrect: false },
                    { text: 'Berlin', isCorrect: false },
                    { text: 'Madrid', isCorrect: false }
                ],
                type: 'multiple-choice',
                category: { _id: '1', name: 'Geography' },
                author: { _id: 'userId1', name: 'Author 1' },
                resourceType: 'educational'
            },
            {
                title: 'Question 2',
                text: 'What is 2 + 2?',
                answers: [
                    { text: '3', isCorrect: false },
                    { text: '4', isCorrect: true },
                    { text: '5', isCorrect: false }
                ],
                type: 'multiple-choice',
                category: { _id: '2', name: 'Mathematics' },
                author: { _id: 'userId2', name: 'Author 2' },
                resourceType: 'educational'
            }
        ],
        count: 2
    };

    describe('getQuestions', () => {
        test('Should retrieve questions based on query param and user', async () => {
            const mockCategoriesOptions = ['Geography', 'Mathematics'];
            const mockMatchOptions = {
                author: 'userId',
                title: 'test',
                category: mockCategoriesOptions,
            };
            const mockSortOptions = { createdAt: 'desc' };

            questionService.getQuestions.mockResolvedValue(mockQuestions);
            getCategoriesOptions.mockReturnValue(mockCategoriesOptions);
            getMatchOptions.mockReturnValue(mockMatchOptions);
            getSortOptions.mockReturnValue(mockSortOptions);

            const res = await request(app)
                .get('/')
                .query({
                    title: 'test',
                    sort: JSON.stringify({ order: 'desc', orderBy: 'createdAt' }),
                    skip: '0',
                    limit: '10',
                    categories: 'Geography,Mathematics',
                })
                .set('user', JSON.stringify({ id: "userId" }))

            expect(res.status).toBe(200)
            expect(res.body).toEqual(mockQuestions)
            expect(getCategoriesOptions).toHaveBeenCalledWith('Geography,Mathematics')
            expect(getMatchOptions).toHaveBeenCalledWith({
                author: 'userId',
                title: 'test',
                category: mockCategoriesOptions,
            })
            expect(getSortOptions).toHaveBeenCalledWith(JSON.stringify({
                order: 'desc',
                orderBy: 'createdAt',
            }));
            expect(questionService.getQuestions).toHaveBeenCalledWith(
                mockMatchOptions,
                mockSortOptions,
                0,
                10
            )
        })
    })

    describe('getQuestionById', () => {
        test('Should retrieve a question by id', async () => {
            const mockQuestion = {
                _id: 'questionId1',
                title: 'Question 1',
                text: 'What is the capital of France?',
                answers: [
                    { text: 'Paris', isCorrect: true },
                    { text: 'London', isCorrect: false },
                    { text: 'Berlin', isCorrect: false },
                    { text: 'Madrid', isCorrect: false }
                ],
                type: 'multiple-choice',
                category: { _id: '1', name: 'Geography' },
                author: { _id: 'userId1', name: 'Author 1' },
                resourceType: 'educational'
            };

            Question.findById.mockResolvedValue(mockQuestion)
            questionService.getQuestionById.mockResolvedValue(mockQuestion);

            const res = await request(app)
                .get('/questionId1')
                .set('user', JSON.stringify({ id: "userId" }));

            expect(res.status).toBe(200);
            expect(res.body).toEqual(mockQuestion);
            expect(Question.findById).toHaveBeenCalledWith('questionId1');
            expect(questionService.getQuestionById).toHaveBeenCalledWith('questionId1');
        })
    })

    describe('createQuestion', () => {
        test('Should create a new question', async () => {
            const mockQuestion = {
                _id: 'questionId1',
                title: 'Question 1',
                text: 'What is the capital of France?',
                answers: [
                    { text: 'Paris', isCorrect: true },
                    { text: 'London', isCorrect: false },
                    { text: 'Berlin', isCorrect: false },
                    { text: 'Madrid', isCorrect: false },
                ],
                type: 'multiple-choice',
                category: 'Geography',
                author: 'userId1',
            };

            questionService.createQuestion.mockResolvedValue(mockQuestion)

            const res = await request(app)
                .post('/questions')
                .send({
                    _id: 'questionId1',
                    title: 'Question 1',
                    text: 'What is the capital of France?',
                    answers: [
                        { text: 'Paris', isCorrect: true },
                        { text: 'London', isCorrect: false },
                        { text: 'Berlin', isCorrect: false },
                        { text: 'Madrid', isCorrect: false },
                    ],
                    type: 'multiple-choice',
                    category: 'Geography',
                })
                .set('user', JSON.stringify({ id: 'userId1' }))

            expect(res.status).toBe(201)
            expect(res.body).toEqual(mockQuestion)
            expect(questionService.createQuestion).toHaveBeenCalledWith('userId1', {
                _id: 'questionId1',
                title: 'Question 1',
                text: 'What is the capital of France?',
                answers: [
                    { text: 'Paris', isCorrect: true },
                    { text: 'London', isCorrect: false },
                    { text: 'Berlin', isCorrect: false },
                    { text: 'Madrid', isCorrect: false },
                ],
                type: 'multiple-choice',
                category: 'Geography',
            })
        })
    })

    describe('deleteQuestion', () => {
        test('Should delete a question', async () => {
            questionService.deleteQuestion.mockResolvedValue();

            const res = await request(app)
                .delete('/questions/questionId1')
                .set('user', JSON.stringify({ id: 'userId1' }));

            expect(res.status).toBe(204);
            expect(questionService.deleteQuestion).toHaveBeenCalledWith('questionId1', 'userId1');
        })
    })

    describe('updateQuestion', () => {
        test('Should update existing question if user is an author', async () => {
            const mockQuestion = {
                _id: 'questionId1',
                title: 'Question 1',
                text: 'What the capital of France?',
                author: 'userId1',
                category: { _id: 'categoryId1', name: 'Geography' },
                save: jest.fn().mockResolvedValue(),
                populate: jest.fn().mockResolvedValue({
                    _id: 'questionId1',
                    title: 'Updated question',
                    text: 'What is the capital of France?',
                    author: 'userId1',
                    category: { _id: 'categoryId1', name: 'Geography' },
                }),
            };

            questionService.updateQuestion.mockResolvedValue(mockQuestion.populate())

            const res = await request(app)
                .put('/questions/questionId1')
                .send({
                    title: 'Updated question',
                    text: 'What is the capital of France?'
                })
                .set('user', JSON.stringify({ id: 'userId1' }))

            const { title, text } = res.body

            expect(res.status).toBe(200)
            expect(title).toEqual('Updated question')
            expect(text).toEqual('What is the capital of France?')
            expect(questionService.updateQuestion).toHaveBeenCalledWith(
                'questionId1',
                'userId1',
                {
                    title: 'Updated question',
                    text: 'What is the capital of France?'
                }
            )
        })

        test('Should throw createForbiddenError when user is not the author', async () => {
            // Mock request and response objects
            const req = {
                params: { id: 'questionId1' },
                user: { id: 'userId1' },
                body: { title: 'Updated question', text: 'What is the capital of France?' }
            }

            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            }

            const forbiddenError = {
                status: 403,
                code: 'FORBIDDEN',
                message: 'You do not have permission to perform this action.'
            };

            const mockUpdateQuestionService = jest.fn().mockRejectedValue(forbiddenError)

            await updateQuestionHandler(req, res, mockUpdateQuestionService)
            expect(res.status).toHaveBeenCalledWith(403)
            expect(res.json).toHaveBeenCalledWith({
                code: FORBIDDEN.code,
                message: FORBIDDEN.message
            })

            expect(mockUpdateQuestionService).toHaveBeenCalledWith(
                'questionId1',
                'userId1',
                {
                    title: 'Updated question',
                    text: 'What is the capital of France?'
                }
            )
        })
    })
})