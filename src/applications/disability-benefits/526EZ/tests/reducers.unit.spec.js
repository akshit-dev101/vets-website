import moment from 'moment';

import { requestStates } from 'platform/utilities/constants';
import { itfStatuses } from '../constants';

import {
  ITF_FETCH_INITIATED,
  ITF_FETCH_SUCCEEDED,
  ITF_FETCH_FAILED,
  ITF_CREATION_INITIATED,
  ITF_CREATION_SUCCEEDED,
  ITF_CREATION_FAILED,
} from '../actions';

import reducers from '../reducers';

const initialState = {
  fetchCallState: requestStates.notCalled,
  creationCallState: requestStates.notCalled,
  currentITF: null,
  previousITF: null,
};

describe('ITF reducer', () => {
  const { itf } = reducers;

  test('should handle ITF_FETCH_INITIATED', () => {
    const newState = itf(initialState, { type: ITF_FETCH_INITIATED });
    expect(newState.fetchCallState).toBe(requestStates.pending);
  });

  describe('ITF_FETCH_SUCCEEDED', () => {
    // These also test that it filters for compensation ITFs
    test('should set the currentITF to the active one if present', () => {
      const action = {
        type: ITF_FETCH_SUCCEEDED,
        data: {
          attributes: {
            intentToFile: [
              {
                type: 'something not compensation',
                status: itfStatuses.active,
              },
              {
                type: 'compensation',
                status: itfStatuses.active,
                expirationDate: moment()
                  .add(1, 'days')
                  .format(),
              },
              {
                // duplicate ITF with later expiration date; should use the active one
                type: 'compensation',
                status: itfStatuses.duplicate,
                expirationDate: moment()
                  .add(1, 'year')
                  .format(),
              },
            ],
          },
        },
      };
      const newState = itf(initialState, action);
      expect(newState.currentITF.status).toBe(itfStatuses.active);
    });

    test(
      'should set the currentITF to the one with the latest expiration date if no active one is present',
      () => {
        const action = {
          type: ITF_FETCH_SUCCEEDED,
          data: {
            attributes: {
              intentToFile: [
                {
                  type: 'something not compensation',
                  status: itfStatuses.active,
                },
                {
                  type: 'compensation',
                  status: itfStatuses.expired,
                  expirationDate: moment()
                    .subtract(1, 'd')
                    .format(),
                },
                {
                  type: 'compensation',
                  status: itfStatuses.duplicate,
                  expirationDate: moment()
                    .add(1, 'd')
                    .format(),
                },
              ],
            },
          },
        };
        const newState = itf(initialState, action);
        expect(newState.currentITF.status).toBe(itfStatuses.duplicate);
      }
    );
  });

  test('should handle ITF_FETCH_FAILED', () => {
    const newState = itf(initialState, { type: ITF_FETCH_FAILED });
    expect(newState.fetchCallState).toBe(requestStates.failed);
  });

  test('should handle ITF_CREATION_INITIATED', () => {
    const newState = itf(initialState, { type: ITF_CREATION_INITIATED });
    expect(newState.creationCallState).toBe(requestStates.pending);
  });

  test('should handle ITF_CREATION_SUCCEEDED', () => {
    const action = {
      type: ITF_CREATION_SUCCEEDED,
      data: {
        attributes: {
          intentToFile: 'new itf',
        },
      },
    };
    const newState = itf({ currentITF: 'old itf' }, action);
    expect(newState.previousITF).toBe('old itf');
    expect(newState.currentITF).toBe('new itf');
  });

  test('should handle ITF_CREATION_FAILED', () => {
    const newState = itf(initialState, { type: ITF_CREATION_FAILED });
    expect(newState.creationCallState).toBe(requestStates.failed);
  });
});
