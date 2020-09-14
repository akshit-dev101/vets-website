import contractTest from 'platform/testing/contract';

import { searchWithBounds } from '../../actions';
import { eachLike } from '@pact-foundation/pact/dsl/matchers';

const bounds = ['-112.54', '32.53', '-111.04', '34.03'];

/* eslint-disable camelcase */
const interaction = {
  state: 'facilities: ccp data exists',
  uponReceiving: 'a request for ccp data',
  withRequest: {
    method: 'GET',
    path: '/v1/facilities/ccp',
    headers: {
      'Content-Type': 'application/json',
      'X-Key-Inflection': 'camel',
    },
    query: {
      bbox: bounds,
      type: 'pharmacy',
      page: 1,
      per_page: 10,
    },
  },
  willRespondWith: {
    status: 200,
    body: {
      data: eachLike({
        id: '1972660348',
        type: 'provider',
        attributes: {
          acc_new_patients: 'false',
          address: {
            street: '2750 E GERMANN RD',
            city: 'CHANDLER',
            state: 'AZ',
            zip: '85249',
          },
          caresite_phone: '4808122942',
          email: 'ENROLLM@WAL-MART.COM',
          gender: 'NotSpecified',
          lat: 33.281291,
          long: -111.793486,
          name: 'WAL-MART',
          unique_id: '1972660348',
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

contractTest('Facility Locator', 'VA.gov API', mockApi => {
  describe('GET /v1/facilities/ccp', () => {
    context('facilities: ccp data exists', () => {
      it('responds with status 200 for pharmacy', async () => {
        mockApi.addInteraction(interaction);
        await searchWithBounds(bounds, 'pharmacy');
      });
    });
  });
});
