import sinon from 'sinon';

import {
  mockFetch,
  resetFetch,
  setFetchJSONFailure as setFetchFailure,
  setFetchJSONResponse as setFetchResponse,
} from 'platform/testing/unit/helpers.js';

import {
  beneficiaryZIPCodeChanged,
  FETCH_BAH_FAILED,
  FETCH_BAH_STARTED,
  FETCH_BAH_SUCCEEDED,
  fetchProfile,
  FETCH_PROFILE_STARTED,
  FETCH_PROFILE_FAILED,
  FETCH_PROFILE_SUCCEEDED,
  fetchInstitutionAutocompleteSuggestions,
  fetchProgramAutocompleteSuggestions,
  fetchConstants,
  fetchInstitutionSearchResults,
  AUTOCOMPLETE_SUCCEEDED,
  AUTOCOMPLETE_FAILED,
  FETCH_CONSTANTS_STARTED,
  FETCH_CONSTANTS_FAILED,
  SEARCH_STARTED,
  SEARCH_FAILED,
} from '../../actions/index';

describe('beneficiaryZIPCodeChanged', () => {
  beforeEach(() => mockFetch());
  test(
    'should return BENEFICIARY_ZIP_CODE_CHANGED when zip code is no valid for submission',
    () => {
      const actualAction = beneficiaryZIPCodeChanged('1111');

      const expectedAction = {
        type: 'BENEFICIARY_ZIP_CODE_CHANGED',
        beneficiaryZIP: '1111',
      };
      expect(expectedAction).toEqual(actualAction);
    }
  );

  test('should dispatch started and success actions', done => {
    const payload = {
      data: {
        attributes: {
          mha_rate: 300, // eslint-disable-line camelcase
          mha_name: 'New York, NY', // eslint-disable-line camelcase
        },
      },
    };
    setFetchResponse(global.fetch.onFirstCall(), payload);

    const dispatch = sinon.spy();

    beneficiaryZIPCodeChanged('12345')(dispatch);

    expect(
      dispatch.firstCall.calledWith({
        type: FETCH_BAH_STARTED,
        beneficiaryZIPFetched: '12345',
      }),
    ).toBe(true);

    setTimeout(() => {
      expect(
        dispatch.secondCall.calledWith({
          type: FETCH_BAH_SUCCEEDED,
          payload,
          beneficiaryZIPFetched: '12345',
        }),
      ).toBe(true);
      done();
    }, 0);
  });

  test('should dispatch started and failed actions', done => {
    const payload = {
      errors: [
        {
          title: 'error',
        },
      ],
    };
    setFetchFailure(global.fetch.onFirstCall(), payload);

    const dispatch = sinon.spy();

    beneficiaryZIPCodeChanged('12345')(dispatch);

    expect(
      dispatch.firstCall.calledWith({
        type: FETCH_BAH_STARTED,
        beneficiaryZIPFetched: '12345',
      }),
    ).toBe(true);

    setTimeout(() => {
      const {
        beneficiaryZIPFetched,
        type,
        error,
      } = dispatch.secondCall.args[0];
      expect(type).toEqual(FETCH_BAH_FAILED);
      expect(error instanceof Error).toBe(true);
      expect(beneficiaryZIPFetched).toBe('12345');
      done();
    }, 0);
  });

  afterEach(() => resetFetch());
});

describe('fetchProfile', () => {
  beforeEach(() => mockFetch());
  test('should dispatch a started and success action', done => {
    const institutionPayload = {
      meta: {
        version: 1,
      },
      data: {
        attributes: {
          mha_rate: 300, // eslint-disable-line camelcase
          mha_name: 'New York, NY', // eslint-disable-line camelcase
        },
      },
    };

    const constants = {
      constants: {
        AVGVABAH: 10,
        AVGDODBAH: 10,
      },
    };

    const getState = () => ({ constants });

    setFetchResponse(global.fetch.onFirstCall(), institutionPayload);

    const dispatch = sinon.spy();

    fetchProfile('12345')(dispatch, getState);

    expect(
      dispatch.firstCall.calledWith({
        type: FETCH_PROFILE_STARTED,
      }),
    ).toBe(true);

    setTimeout(() => {
      expect(
        dispatch.secondCall.calledWith({
          type: FETCH_PROFILE_SUCCEEDED,
          payload: {
            ...institutionPayload,
            ...constants.constants,
          },
        }),
      ).toBe(true);
      done();
    }, 0);
  });

  test(
    'should dispatch a started and failed action when the institution call fails',
    done => {
      const payload = {
        errors: [
          {
            title: 'error',
          },
        ],
      };
      setFetchFailure(global.fetch.onFirstCall(), payload);

      const dispatch = sinon.spy();

      fetchProfile('12345')(dispatch);

      expect(
        dispatch.firstCall.calledWith({
          type: FETCH_PROFILE_STARTED,
        }),
      ).toBe(true);

      setTimeout(() => {
        const { type } = dispatch.secondCall.args[0];
        expect(type).toEqual(FETCH_PROFILE_FAILED);
        done();
      }, 0);
    }
  );

  test(
    'should dispatch a started and success action when the zip code rates call fails',
    done => {
      const institutionPayload = {
        meta: {
          version: 1,
        },
        data: {
          attributes: {
            mha_rate: 300, // eslint-disable-line camelcase
            mha_name: 'New York, NY', // eslint-disable-line camelcase
          },
        },
      };
      const constants = {
        constants: {
          AVGVABAH: 10,
          AVGDODBAH: 10,
        },
      };

      const getState = () => ({ constants });
      setFetchResponse(global.fetch.onFirstCall(), institutionPayload);

      const dispatch = sinon.spy();

      fetchProfile('12345')(dispatch, getState);

      expect(
        dispatch.firstCall.calledWith({
          type: FETCH_PROFILE_STARTED,
        }),
      ).toBe(true);

      setTimeout(() => {
        expect(
          dispatch.secondCall.calledWith({
            type: FETCH_PROFILE_SUCCEEDED,
            payload: {
              ...institutionPayload,
              ...constants.constants,
            },
          }),
        ).toBe(true);
        done();
      }, 0);
    }
  );
  afterEach(() => resetFetch());
});

describe('institution autocomplete', () => {
  beforeEach(() => mockFetch());
  test('should dispatch a success action', done => {
    const autocompleteResults = {
      meta: {
        version: 1,
      },
      data: [],
    };

    setFetchResponse(global.fetch.onFirstCall(), autocompleteResults);

    const dispatch = sinon.spy();

    fetchInstitutionAutocompleteSuggestions('test', {})(dispatch);

    setTimeout(() => {
      expect(
        dispatch.firstCall.calledWith({
          type: AUTOCOMPLETE_SUCCEEDED,
          payload: {
            ...autocompleteResults,
          },
        }),
      ).toBe(true);
      done();
    }, 0);
  });

  test('should dispatch a failure action', done => {
    const error = { test: 'test' };
    setFetchFailure(global.fetch.onFirstCall(), error);

    const dispatch = sinon.spy();

    fetchInstitutionAutocompleteSuggestions('test', {})(dispatch);

    setTimeout(() => {
      const { type, err } = dispatch.firstCall.args[0];
      expect(type).toEqual(AUTOCOMPLETE_FAILED);
      expect(err instanceof Error).toBe(true);
      done();
    }, 0);
  });
});

describe('institution program autocomplete', () => {
  beforeEach(() => mockFetch());
  test('should dispatch a success action', done => {
    const autocompleteResults = {
      meta: {
        version: 1,
      },
      data: [],
    };

    setFetchResponse(global.fetch.onFirstCall(), autocompleteResults);

    const dispatch = sinon.spy();

    fetchProgramAutocompleteSuggestions('test', {})(dispatch);

    setTimeout(() => {
      expect(
        dispatch.firstCall.calledWith({
          type: AUTOCOMPLETE_SUCCEEDED,
          payload: {
            ...autocompleteResults,
          },
        }),
      ).toBe(true);
      done();
    }, 0);
  });

  test('should dispatch a failure action', done => {
    const error = { test: 'test' };
    setFetchFailure(global.fetch.onFirstCall(), error);

    const dispatch = sinon.spy();

    fetchProgramAutocompleteSuggestions('test', {})(dispatch);

    setTimeout(() => {
      const { type, err } = dispatch.firstCall.args[0];
      expect(type).toEqual(AUTOCOMPLETE_FAILED);
      expect(err instanceof Error).toBe(true);
      done();
    }, 0);
  });
});

describe('institution search', () => {
  beforeEach(() => mockFetch());

  test('should dispatch a failure action', done => {
    const error = { test: 'test' };
    setFetchFailure(global.fetch.onFirstCall(), error);

    const dispatch = sinon.spy();

    fetchInstitutionSearchResults('@@', {})(dispatch);

    expect(dispatch.firstCall.args[0].type).toBe(SEARCH_STARTED);

    setTimeout(() => {
      const { payload } = dispatch.secondCall.args[0];

      expect(dispatch.secondCall.args[0]).toEqual({
        type: SEARCH_FAILED,
        payload,
      });
      done();
    }, 0);
  });
});

describe('constants', () => {
  beforeEach(() => mockFetch());

  test('should dispatch a failure action', done => {
    const error = { test: 'test' };
    setFetchFailure(global.fetch.onFirstCall(), error);

    const dispatch = sinon.spy();

    fetchConstants('test')(dispatch);

    expect(dispatch.firstCall.args[0].type).toBe(FETCH_CONSTANTS_STARTED);

    setTimeout(() => {
      const { payload } = dispatch.secondCall.args[0];

      expect(dispatch.secondCall.args[0]).toEqual({
        type: FETCH_CONSTANTS_FAILED,
        payload,
      });
      done();
    }, 0);
  });
});
