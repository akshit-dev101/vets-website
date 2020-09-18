import contractTest from 'platform/testing/contract';

import { fetchLocations } from '../../actions';
import { eachLike } from '@pact-foundation/pact/dsl/matchers';
import sinon from 'sinon';

const bounds = ['-112.54', '32.53', '-111.04', '34.03'];
const address = 'South Gilbert Road, Chandler, Arizona 85286, United States';

const interaction = {
  state: 'ccp data exists',
  uponReceiving: 'a request for ccp data',
  withRequest: {
    method: 'GET',
    path: '/v1/facilities/ccp',
    headers: {
      'X-Key-Inflection': 'camel',
    },
    query: {
      address,
      'bbox[]': bounds,
      type: 'pharmacy',
      page: '1',
      // eslint-disable-next-line camelcase
      per_page: '10',
      trim: 'true',
    },
  },
  willRespondWith: {
    status: 200,
    body: {
      data: eachLike({
        id: '1972660348',
        type: 'provider',
        attributes: {
          accNewPatients: 'false',
          address: {
            street: '2750 E GERMANN RD',
            city: 'CHANDLER',
            state: 'AZ',
            zip: '85249',
          },
          caresitePhone: '4808122942',
          email: 'ENROLLM@WAL-MART.COM',
          gender: 'NotSpecified',
          lat: 33.281291,
          long: -111.793486,
          name: 'WAL-MART',
          uniqueId: '1972660348',
        },
        relationships: {
          specialties: {
            data: [
              {
                id: '3336C0003X',
                type: 'specialty',
              },
            ],
          },
        },
      }),
    },
  },
};

const dispatch = sinon.stub();

contractTest('Facility Locator', 'VA.gov API', mockApi => {
  describe('GET /v1/facilities/ccp', () => {
    context('facilities: ccp data exists', () => {
      it('responds with status 200 for pharmacy', async () => {
        await mockApi().addInteraction(interaction);
        await fetchLocations(address, bounds, 'pharmacy', null, 1, dispatch);
      });
    });
  });
});
