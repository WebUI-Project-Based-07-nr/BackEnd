const { INVALID_LANGUAGE } = require('~/consts/errors');
const { createError } = require('~/utils/errorsHelper');
const {
  enums: { APP_LANG_ENUM }
} = require('~/consts/validation');

const langMiddleware = require('~/middlewares/appLanguage');

jest.mock('~/utils/errorsHelper', () => ({
  createError: jest.fn(),
}));

describe('langMiddleware', () => {  
  let req, res, next;

  beforeEach(() => {
    req = {
      acceptsLanguages: jest.fn(),
    };
    res = {};
    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should set req.lang and call next when a valid language is provided', () => {
    const validLang = APP_LANG_ENUM[0];
    req.acceptsLanguages.mockReturnValue(validLang);

    langMiddleware(req, res, next);

    expect(req.acceptsLanguages).toHaveBeenCalledWith(...APP_LANG_ENUM);
    expect(req.lang).toBe(validLang);
    expect(next).toHaveBeenCalled();
  });

  test('should throw an error when no valid language is provided', () => {
    req.acceptsLanguages.mockReturnValue(false);
    const error = new Error(INVALID_LANGUAGE);
    createError.mockReturnValue(error);

    expect(() => langMiddleware(req, res, next)).toThrow(error);

    expect(req.acceptsLanguages).toHaveBeenCalledWith(...APP_LANG_ENUM);
    expect(createError).toHaveBeenCalledWith(400, INVALID_LANGUAGE);
    expect(next).not.toHaveBeenCalled();
  });
});
