const mongoose = require('mongoose');
const Offer = require('~/models/offer');
const offerService = require('~/services/offer');
const filterAllowedFields = require('~/utils/filterAllowedFields');
const { allowedOfferFieldsForUpdate } = require('~/validation/services/offer');

jest.mock('~/models/offer');
jest.mock('~/utils/filterAllowedFields');
jest.mock('~/validation/services/offer');

describe('offerService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getOffers', () => {
    it('should return aggregated offers', async () => {
      const pipeline = [{ $match: { status: 'active' } }];
      const fakeResponse = [{ _id: mongoose.Types.ObjectId(), title: 'Offer Title' }];

      Offer.aggregate.mockReturnValue({
        exec: jest.fn().mockResolvedValue(fakeResponse)
      });

      const result = await offerService.getOffers(pipeline);

      expect(result).toEqual(fakeResponse[0]);
      expect(Offer.aggregate).toHaveBeenCalledWith(pipeline);
    });
  });

  describe('getOfferById', () => {
    it('should return an offer with populated author, subject, and category fields', async () => {
      const id = mongoose.Types.ObjectId();
      const fakeOffer = {
        _id: id,
        author: {
          firstName: 'John',
          lastName: 'Doe',
          totalReviews: 10,
          averageRating: 4.5,
          photo: 'photoUrl',
          professionalSummary: 'Expert in something',
          FAQ: { teacher: 'Some FAQ' }
        },
        authorRole: 'teacher',
        subject: { name: 'Math' },
        category: { appearance: 'Science' }
      };

      const execMock = jest.fn().mockResolvedValue(fakeOffer);
      const leanMock = jest.fn().mockReturnThis();
      const populateMock = jest.fn().mockReturnThis();
      Offer.findById.mockReturnValue({
        populate: populateMock,
        lean: leanMock,
        exec: execMock
      });

      const result = await offerService.getOfferById(id);

      expect(result).toBe(fakeOffer);
      expect(Offer.findById).toHaveBeenCalledWith(id);
      expect(populateMock).toHaveBeenCalled();
      expect(leanMock).toHaveBeenCalled();
      expect(execMock).toHaveBeenCalled();
    });
  });

  describe('createOffer', () => {
    it('should create a new offer', async () => {
      const author = mongoose.Types.ObjectId();
      const authorRole = 'teacher';
      const data = {
        price: 100,
        proficiencyLevel: 'expert',
        title: 'New Offer',
        description: 'Description of the offer',
        languages: ['English', 'Spanish'],
        subject: mongoose.Types.ObjectId(),
        category: mongoose.Types.ObjectId(),
        status: 'active',
        FAQ: [{ question: 'What is this?', answer: 'An offer' }]
      };

      Offer.create.mockResolvedValue({ _id: mongoose.Types.ObjectId(), ...data });

      const result = await offerService.createOffer(author, authorRole, data);

      expect(result).toEqual({ _id: expect.any(mongoose.Types.ObjectId), ...data });
      expect(Offer.create).toHaveBeenCalledWith({
        author,
        authorRole,
        ...data
      });
    });
  });

  describe('updateOffer', () => {
    it('should update an existing offer', async () => {
      const id = mongoose.Types.ObjectId();
      const currentUserId = mongoose.Types.ObjectId();
      const updateData = {
        price: 150,
        title: 'Updated Offer'
      };
      const filteredUpdateData = {
        price: 150,
        title: 'Updated Offer'
      };

      filterAllowedFields.mockReturnValue(filteredUpdateData);

      const offer = {
        save: jest.fn(),
        validate: jest.fn().mockResolvedValue({})
      };

      Offer.findById.mockResolvedValue(offer);

      await offerService.updateOffer(id, currentUserId, updateData);

      for (let field in filteredUpdateData) {
        expect(offer[field]).toBe(filteredUpdateData[field]);
      }

      expect(offer.save).toHaveBeenCalled();
      expect(filterAllowedFields).toHaveBeenCalledWith(updateData, allowedOfferFieldsForUpdate);
      expect(Offer.findById).toHaveBeenCalledWith(id);
    });
  });

  describe('deleteOffer', () => {
    it('should delete an existing offer', async () => {
      const id = mongoose.Types.ObjectId();
      const execMock = jest.fn().mockResolvedValue({ _id: id });

      Offer.findByIdAndRemove.mockReturnValue({
        exec: execMock
      });

      await offerService.deleteOffer(id);

      expect(Offer.findByIdAndRemove).toHaveBeenCalledWith(id);
      expect(execMock).toHaveBeenCalled();
    });
  });

});
