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
    const expectedSender = (user, email, templateSubject, html) => ({
        from: `Space2Study <${user}>`,
        to: email,
        subject: templateSubject,
        html
    })

    beforeEach(() => {
        jest.clearAllMocks()
    })

    test('Should send an email with correct template and data', async () => {
        const email = "test@example.com"
        const subject = "EMAIL_CONFIRMATION"
        const language = "en"
        const text = { name: "John" }

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
        expect(sendMail).toHaveBeenCalledWith(expectedSender(gmailCredentials.user, email, templateSubject, html))
    })

    test('Should throw an error if sendEmail fails', async () => {
        const email = "test@example.com"
        const subject = "EMAIL_CONFIRMATION"
        const language = "en"
        const text = { name: "John" }

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
        sendMail.mockRejectedValue(new Error("Failed to send email"))

        await expect(emailService.sendEmail(email, subject, language, text)).rejects.toThrow("Failed to send email")

        expect(EmailTemplates.prototype.render).toHaveBeenCalledWith(template, text)
        expect(sendMail).toHaveBeenCalledWith(expectedSender(gmailCredentials.user, email, templateSubject, html))
    })

    test('Should throw an error when template is not found', async () => {
        const email = "test@example.com"
        const subject = "nonexistent"
        const language = "en"
        const text = { name: "John" }

        templateList[subject] = undefined;

        createError.mockImplementation((status, errorInfo) => {
            const err = new Error(errorInfo.message)
            err.status = status
            err.code = errorInfo.code

            return err
        })

        await expect(emailService.sendEmail(email, subject, language, text))
            .rejects
            .toThrowError(TEMPLATE_NOT_FOUND)

        expect(createError).toHaveBeenCalledWith(404, TEMPLATE_NOT_FOUND)
        expect(EmailTemplates.prototype.render).not.toHaveBeenCalled()
        expect(sendMail).not.toHaveBeenCalled()
    })
})
