const emailService = require('~/services/email')
const emailSubject = require('~/consts/emailSubject')
const AdminInvitation = require('~/models/adminInvitation')
const adminInvitationService = require('~/services/adminInvitation')


jest.mock('~/services/email')
jest.mock('~/models/adminInvitation')

describe("adminInvitation service", () => {
    describe('sendAdminInvitations', () => {
        test('Should send admin invitation and save them to the database', async () => {
            let emails = ['test1@example.com', 'test2@example.com']
            const language = 'en'

            AdminInvitation.create.mockImplementation((invitation) => ({
                ...invitation,
                dateOfInvitation: new Date()
            }))
            emailService.sendEmail.mockResolvedValue()

            const result = await adminInvitationService.sendAdminInvitations(emails, language)

            expect(result).toEqual(
                emails.map((email) => ({
                    email,
                    dateOfInvitation: expect.any(Date)
                }))
            )

            expect(AdminInvitation.create).toHaveBeenCalledTimes(emails.length)

            emails.forEach((email, index) => {
                expect(AdminInvitation.create).toHaveBeenNthCalledWith(index + 1, { email })
                expect(emailService.sendEmail).toHaveBeenNthCalledWith(
                    index + 1,
                    email,
                    emailSubject.ADMIN_INVITATION,
                    language,
                    { email }
                )
            })
        })
    })
})
