const EmailTemplates = require('email-templates')
const emailService = require('~/services/email');
const { sendMail } = require('~/utils/mailer')
const { templateList } = require('~/emails')
const { createError } = require('~/utils/errorsHelper')
const { TEMPLATE_NOT_FOUND } = require('~/consts/errors')
const { gmailCredentials } = require('~/configs/config');


jest.mock('email-templates')
jest.mock('~/utils/mailer')
jest.mock('~/emails')
jest.mock('~/utils/errorsHelper')
jest.mock('~/configs/config');


describe("Email service", () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    test('Should send an email with correct template and data', async () => {
        const email = "test@example.com"
        const subject = "EMAIL_CONFIRMATION"
        const language = "en"
        const text = { name: "John" }
        const user = gmailCredentials.user

        const template = "en/confirm-email"
        const templateSubject = "Please confirm your email"

        templateList[subject] = {
            [language]: {
                template,
                subject: templateSubject
            }
        }

        const html = '<h1>Greetings</h1>'

        EmailTemplates.prototype.render.mockResolvedValue(html)
        sendMail.mockResolvedValue()

        await emailService.sendEmail(email, subject, language, text)

        expect(EmailTemplates.prototype.render).toHaveBeenCalledWith(template, text)
        expect(sendMail).toHaveBeenCalledWith({
            from: `Space2Study <${user}>`,
            to: email,
            subject: templateSubject,
            html
        })
    })
})
