import MockApi from './MockLocatorApi';
import LiveApi from './LocatorApi';
import environment from 'platform/utilities/environment';

// To use vets-api data locally, replace the following with this:
// export default LiveApi;

const getAPI = () => {
  // eslint-disable-next-line no-console
  console.log('window.disableMockLocatorApi', window.disableMockLocatorApi);

  return !window.disableMockLocatorApi &&
    (environment.isLocalhost() || window.Cypress) &&
    !environment.API_URL.includes('review.vetsgov')
    ? MockApi
    : LiveApi;
};

export default getAPI();
