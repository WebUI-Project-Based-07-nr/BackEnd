const request = require('supertest')
const express = require('express')
const bodyParser = require('body-parser')
const questionService = require('~/services/question')
const getCategoriesOptions = require('~/utils/getCategoriesOption')
const getMatchOptions = require('~/utils/getMatchOptions')
const getSortOptions = require('~/utils/getSortOptions')
const { getQuestions } = require('~/controllers/question')
const { connect, closeDatabase, clearDatabase } = require('~/test/dbHandler')

jest.mock('~/services/question')
jest.mock('~/utils/getCategoriesOption')
jest.mock('~/utils/getMatchOptions')
jest.mock('~/utils/getSortOptions')

const app = express()
app.use(bodyParser.json())

app.use((req, res, next) => {
    if (req.headers.user) {
        req.user = JSON.parse(req.headers.user);
    }
    next();
});

app.get('/questions', getQuestions)

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

    describe('getQuestions', () => {
        test('Should retrieve questions based on query param and user', async () => {
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
                .get('/questions')
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
})