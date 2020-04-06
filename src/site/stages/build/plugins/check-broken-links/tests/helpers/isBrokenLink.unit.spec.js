const isBrokenLink = require('../../helpers/isBrokenLink');

describe('isBrokenLink', () => {
  const page = '/health-care/';
  const files = new Set([
    'index.html',
    'health-care/index.html',
    'disability/index.html',
    'good-asset.pdf',
    'downloads/good asset.pdf',
  ]);

  const badLinks = [
    null,
    undefined,
    '',
    'health-care',
    '/bad-link',
    '/bad-asset.pdf',
    '/bad asset.pdf',
    'example@example.com',
  ];

  for (const badLink of badLinks) {
    test(`returns true for invalid link value - ${badLink}`, () => {
      const result = isBrokenLink(badLink, page, files);
      expect(result).toBe(true);
    });
  }

  const goodLinks = [
    '/',
    '/health-care',
    '/disability',
    '/good-asset.pdf',
    '/downloads/good%20asset.pdf',
    'mailto:example@example.com',
    'https://www.example.com',
  ];

  for (const goodLink of goodLinks) {
    test(`returns false for valid link value - ${goodLink}`, () => {
      const result = isBrokenLink(goodLink, page, files);
      expect(result).toBe(false);
    });
  }
});
