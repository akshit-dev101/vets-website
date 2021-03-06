import React, { useEffect } from 'react';
import { WIZARD_STATUS, WIZARD_STATUS_INELIGIBLE } from '../../constants';

const DischargeNotification = () => {
  useEffect(() => {
    sessionStorage.setItem(WIZARD_STATUS, WIZARD_STATUS_INELIGIBLE);
  });
  return (
    <div className="vads-u-margin-top--2 vads-u-padding--3 vads-u-background-color--primary-alt-lightest">
      <p className="vads-u-margin--0">
        To be eligible for career planning and guidance, you or your sponsor
        must have been discharged from active duty in the last year, or have
        less than 6 months until discharge.
      </p>
    </div>
  );
};

export default {
  name: 'dischargeNotification',
  component: DischargeNotification,
};
