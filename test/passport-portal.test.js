'use strict';

const mock = require('egg-mock');

describe('test/passport-portal.test.js', () => {
  let app;
  before(() => {
    app = mock.app({
      baseDir: 'apps/passport-portal-test',
    });
    return app.ready();
  });

  after(() => app.close());
  afterEach(mock.restore);

  it('should GET /', () => {
    return app.httpRequest()
      .get('/')
      .expect('hi, passportJyb')
      .expect(200);
  });
});
