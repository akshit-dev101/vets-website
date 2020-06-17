import sinon from 'sinon';
import { expect } from 'chai';
import {
  fetchDebtLetters,
  DEBTS_FETCH_INITIATED,
  DEBTS_FETCH_SUCCESS,
} from '../actions';

describe('fetchDebtLetters', () => {
  it('verify return data', () => {
    const dispatch = sinon.spy();
    return fetchDebtLetters()(dispatch).then(() => {
      expect(dispatch.firstCall.args[0].type).to.equal(DEBTS_FETCH_INITIATED);
      expect(dispatch.secondCall.args[0].type).to.equal(DEBTS_FETCH_SUCCESS);
      expect(dispatch.secondCall.args[0].debts).to.deep.equal([
        {
          amountOverpaid: 0,
          amountWithheld: 0,
          benefitType: 'Loan Guaranty (Principal + Interest)',
          debtHistory: [
            {
              date: '09/11/1997',
              debtId: 9,
              description:
                'Account balance cleared via offset, not including TOP.',
              letterCode: '914',
              status: 'Paid In Full',
            },
          ],
          deductionCode: '21',
          fileNumber: '000000009',
          payeeNumber: '00',
          personEntitled: 'STUB_M',
        },
        {
          amountOverpaid: 0,
          amountWithheld: 0,
          benefitType: 'Comp & Pen',
          debtHistory: [
            {
              date: '12/03/2008',
              debtId: 85,
              description: 'Pending review for reclamation or next action.',
              letterCode: '488',
              status: 'Death Status - Pending Action',
            },
            {
              date: '02/07/2009',
              debtId: 85,
              description:
                'Full debt amount cleared by return of funds to DMC from outside entities (reclamations, insurance companies, etc.)',
              letterCode: '905',
              status: 'Administrative Write Off',
            },
            {
              date: '02/25/2009',
              debtId: 85,
              description:
                'Account balance cleared via offset, not including TOP.',
              letterCode: '914',
              status: 'Paid In Full',
            },
          ],
          deductionCode: '30',
          fileNumber: '000000009',
          payeeNumber: '00',
          personEntitled: 'STUB_M',
        },
        {
          amountOverpaid: 0,
          amountWithheld: 0,
          benefitType: 'Comp & Pen',
          debtHistory: [
            {
              date: '03/05/2004',
              debtId: 4378,
              description:
                'Account balance cleared via offset, not including TOP.',
              letterCode: '914',
              status: 'Paid In Full',
            },
          ],
          deductionCode: '30',
          fileNumber: '000000009',
          payeeNumber: '00',
          personEntitled: 'STUB_M',
        },
        {
          amountOverpaid: 16000,
          amountWithheld: 0,
          benefitType: 'CH35 EDU',
          debtHistory: [
            {
              date: '09/18/2012',
              debtId: 7418,
              description:
                'First due process letter sent when debtor is not actively receiving any benefits.',
              letterCode: '100',
              status: 'First Demand Letter - Inactive Benefits',
            },
            {
              date: '09/28/2012',
              debtId: 7418,
              description:
                'Second demand letter where debtor has no active benefits to offset so debtor is informed that debt may be referred to CRA (60 timer), TOP, CAIVRS or Cross Servicing.  CRA is only one with timer.\r\n117A - Second collections letter sent to schools',
              letterCode: '117',
              status: 'Second Demand Letter',
            },
            {
              date: '10/17/2012',
              debtId: 7418,
              description:
                'Originates from mail room Beep File (file of bad addresses to be sent to LexisNexis).  Remains in this status until LexisNexis comes back with updated address information.',
              letterCode: '212',
              status: 'Bad Address - Locator Request Sent',
            },
            {
              date: '11/14/2012',
              debtId: 7418,
              description:
                'Second demand letter where debtor has no active benefits to offset so debtor is informed that debt may be referred to CRA (60 timer), TOP, CAIVRS or Cross Servicing.  CRA is only one with timer.\r\n117A - Second collections letter sent to schools',
              letterCode: '117',
              status: 'Second Demand Letter',
            },
            {
              date: '12/11/2012',
              debtId: 7418,
              description:
                'Demand letters returned.  Unable to verify address with third party.  Account forced to TOP and/or CS.',
              letterCode: '510',
              status:
                'Mailing Status Inactive/Invalid - Forced to TOP/Cross Servicing',
            },
            {
              date: '04/11/2013',
              debtId: 7418,
              description: 'Debt referred to Treasury for Cross servicing',
              letterCode: '080',
              status: 'Referred To Cross Servicing',
            },
            {
              date: '12/19/2014',
              debtId: 7418,
              description:
                'Account returned from Treasury Cross Servicing. Account is at TOP.  TOP offsets will be applied to account as Federal funds become available.',
              letterCode: '681',
              status: 'Returned From Cross Servicing - At TOP',
            },
          ],
          deductionCode: '44',
          fileNumber: '000000009',
          payeeNumber: '00',
          personEntitled: 'STUB_M',
        },
      ]);
    });
  });
});