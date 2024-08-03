const swaggerJsdoc = require('swagger-jsdoc')
const path = require('path')

const SignupSchema = require('~/docs/schemas/auth/signup')
const LoginSchema = require('~/docs/schemas/auth/login')
const ForgotPasswordScheme = require('~/docs/schemas/auth/forgot-password')
const ResetPasswordScheme = require('~/docs/schemas/auth/reset-password')

const SendEmailScheme = require('~/docs/schemas/email/send-email')

const ClearMessageScheme = require('~/docs/schemas/message/clear-message')
const DeleteMessageScheme = require('~/docs/schemas/message/delete-message')
const GetMessageScheme = require('~/docs/schemas/message/get-message')
const SendMessageScheme = require('~/docs/schemas/message/delete-message')

const CreateOfferScheme = require('~/docs/schemas/offers/create-offer')
const DeleteOfferScheme = require('~/docs/schemas/offers/delete-offer')
const GetOfferScheme = require('~/docs/schemas/offers/get-offer-by-id')
const GetOffersScheme = require('~/docs/schemas/offers/get-offers')
const UpdateOfferScheme = require('~/docs/schemas/offers/update-offer')

const CreateQuestionScheme = require('~/docs/schemas/questions/create-question')
const DeleteQuestionScheme = require('~/docs/schemas/questions/delete-question')
const GetQuestionScheme = require('~/docs/schemas/questions/get-question-by-id')
const GetQuestionsScheme = require('~/docs/schemas/questions/get-questions')
const UpdateQuestionScheme = require('~/docs/schemas/questions/update-question-by-id')

const CreateResourcesCategoryScheme = require('~/docs/schemas/resources/create-resources-category')
const DeleteResourcesCategoryScheme = require('~/docs/schemas/resources/delete-resources-category')
const GetResourcesCategoryScheme = require('~/docs/schemas/resources/get-resources')
const UpdateResourcesCategoryScheme = require('~/docs/schemas/resources/update-resources-category')

const ChangeUserStatusScheme = require('~/docs/schemas/users/change-user-status')
const DeleteUserByIdScheme = require('~/docs/schemas/users/delete-user-by-id')
const GetUsersScheme = require('~/docs/schemas/users/get-users')
const UpdateUserByIdScheme = require('~/docs/schemas/users/update-user-by-id')

const CategoryScheme = require('~/docs/schemas/category/category')

const LessonScheme = require('~/docs/schemas/lesson/lesson')

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Documentation',
      version: '1.0.0'
    },
    components: {
      schemas: {
        ...SignupSchema,
        ...LoginSchema,
        ...ForgotPasswordScheme,
        ...ResetPasswordScheme,
        ...SendEmailScheme,
        ...ClearMessageScheme,
        ...DeleteMessageScheme,
        ...GetMessageScheme,
        ...SendMessageScheme,
        ...CreateOfferScheme,
        ...DeleteOfferScheme,
        ...GetOfferScheme,
        ...GetOffersScheme,
        ...UpdateOfferScheme,
        ...CreateQuestionScheme,
        ...DeleteQuestionScheme,
        ...GetQuestionScheme,
        ...GetQuestionsScheme,
        ...UpdateQuestionScheme,
        ...CreateResourcesCategoryScheme,
        ...DeleteResourcesCategoryScheme,
        ...GetResourcesCategoryScheme,
        ...UpdateResourcesCategoryScheme,
        ...ChangeUserStatusScheme,
        ...DeleteUserByIdScheme,
        ...GetUsersScheme,
        ...UpdateUserByIdScheme,
        ...CategoryScheme,
        ...LessonScheme
      }
    }
  },
  apis: [path.resolve(__dirname, '../routes/*.js')]
}

const swaggerSpec = swaggerJsdoc(options)

module.exports = swaggerSpec
