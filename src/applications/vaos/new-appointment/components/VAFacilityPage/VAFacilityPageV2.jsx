import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { scrollAndFocus } from '../../../utils/scrollAndFocus';
import LoadingIndicator from '@department-of-veterans-affairs/formation-react/LoadingIndicator';
import SchemaForm from 'platform/forms-system/src/js/components/SchemaForm';

import * as actions from '../../redux/actions';
import { getFacilityPageV2Info } from '../../../utils/selectors';
import { FETCH_STATUS } from '../../../utils/constants';
import { getParentOfLocation } from '../../../services/location';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';
import EligibilityModal from './EligibilityModal';
import ErrorMessage from '../../../components/ErrorMessage';
import FacilitiesRadioWidget from './FacilitiesRadioWidget';
import FormButtons from '../../../components/FormButtons';
import NoValidVAFacilities from './NoValidVAFacilities';
import NoVASystems from './NoVASystems';
import SingleFacilityEligibilityCheckMessage from './SingleFacilityEligibilityCheckMessage';
import VAFacilityInfoMessage from './VAFacilityInfoMessage';

const initialSchema = {
  type: 'object',
  required: ['vaFacility'],
  properties: {
    vaFacility: {
      type: 'string',
      enum: [],
    },
  },
};

const uiSchema = {
  vaFacility: {
    'ui:title': 'Please select where you’d like to have your appointment.',
    'ui:widget': FacilitiesRadioWidget,
  },
};

const pageKey = 'vaFacilityV2';
const pageTitle = 'Choose a VA location for your appointment';

function VAFacilityPageV2({
  canScheduleAtChosenFacility,
  childFacilitiesStatus,
  data,
  eligibility,
  facilities,
  facility,
  facilityDetails,
  facilityDetailsStatus,
  hasDataFetchingError,
  loadingEligibilityStatus,
  noValidVAParentFacilities,
  noValidVAFacilities,
  openFacilityPageV2,
  pageChangeInProgress,
  parentDetails,
  parentFacilities,
  parentFacilitiesStatus,
  routeToPreviousAppointmentPage,
  routeToNextAppointmentPage,
  schema,
  showEligibilityModal,
  hideEligibilityModal,
  singleValidVALocation,
  siteId,
  typeOfCare,
  updateFormData,
}) {
  const history = useHistory();
  const loadingEligibility = loadingEligibilityStatus === FETCH_STATUS.loading;
  const loadingParents = parentFacilitiesStatus === FETCH_STATUS.loading;
  const loadingFacilities = childFacilitiesStatus === FETCH_STATUS.loading;

  useEffect(
    () => {
      document.title = `${pageTitle} | Veterans Affairs`;
      scrollAndFocus();
      openFacilityPageV2(pageKey, uiSchema, initialSchema);
    },
    [openFacilityPageV2],
  );

  const goBack = () => routeToPreviousAppointmentPage(history, pageKey);

  const goForward = () => routeToNextAppointmentPage(history, pageKey);

  const onFacilityChange = newData => {
    const selectedFacility = facilities?.find(f => f.id === newData.vaFacility);

    const parentId = getParentOfLocation(parentFacilities, selectedFacility)
      ?.id;

    if (!!selectedFacility && !!parentId) {
      updateFormData(pageKey, uiSchema, {
        ...newData,
        vaParent: parentId,
      });
    }
  };

  const title = (
    <h1 className="vads-u-font-size--h2">
      Choose a VA location for your {typeOfCare} appointment
    </h1>
  );

  if (hasDataFetchingError) {
    return (
      <div>
        {title}
        <ErrorMessage />
      </div>
    );
  }

  if (
    loadingParents ||
    loadingFacilities ||
    (singleValidVALocation && loadingEligibility)
  ) {
    return (
      <div>
        {title}
        <LoadingIndicator message="Finding locations" />
      </div>
    );
  }

  if (noValidVAParentFacilities) {
    return (
      <div>
        {title}
        <NoVASystems />
        <div className="vads-u-margin-top--2">
          <FormButtons
            onBack={goBack}
            disabled
            pageChangeInProgress={pageChangeInProgress}
            loadingText="Page change in progress"
          />
        </div>
      </div>
    );
  }

  if (noValidVAFacilities) {
    return (
      <div>
        {title}
        <NoValidVAFacilities
          formContext={{
            siteId,
            typeOfCare,
            facilityDetailsStatus,
            parentDetails,
          }}
        />
        <div className="vads-u-margin-top--2">
          <FormButtons
            onBack={goBack}
            disabled
            pageChangeInProgress={pageChangeInProgress}
            loadingText="Page change in progress"
          />
        </div>
      </div>
    );
  }

  if (singleValidVALocation && !canScheduleAtChosenFacility) {
    return (
      <div>
        {title}
        <SingleFacilityEligibilityCheckMessage
          eligibility={eligibility}
          facility={facility}
        />
        <div className="vads-u-margin-top--2">
          <FormButtons
            onBack={goBack}
            disabled
            pageChangeInProgress={pageChangeInProgress}
            loadingText="Page change in progress"
          />
        </div>
      </div>
    );
  }

  if (singleValidVALocation) {
    return (
      <div>
        {title}
        <VAFacilityInfoMessage facility={facility} />
        <div className="vads-u-margin-top--2">
          <FormButtons
            onBack={goBack}
            onSubmit={goForward}
            pageChangeInProgress={pageChangeInProgress}
            loadingText="Page change in progress"
          />
        </div>
      </div>
    );
  }

  return (
    <div>
      {title}
      <p>
        Below is a list of VA locations where you’re registered that offer{' '}
        {typeOfCare} appointments.
      </p>
      {childFacilitiesStatus === FETCH_STATUS.succeeded && (
        <SchemaForm
          name="VA Facility"
          title="VA Facility"
          schema={schema}
          uiSchema={uiSchema}
          onChange={onFacilityChange}
          onSubmit={goForward}
          data={data}
        >
          <FormButtons
            continueLabel=""
            pageChangeInProgress={pageChangeInProgress}
            onBack={goBack}
            disabled={
              loadingParents ||
              loadingFacilities ||
              loadingEligibility ||
              (facilities?.length === 1 && !canScheduleAtChosenFacility)
            }
          />
          {loadingEligibility && (
            <div aria-atomic="true" aria-live="assertive">
              <AlertBox isVisible status="info" headline="Please wait">
                We’re checking if we can create an appointment for you at this
                facility. This may take up to a minute. Thank you for your
                patience.
              </AlertBox>
            </div>
          )}
        </SchemaForm>
      )}

      {showEligibilityModal && (
        <EligibilityModal
          onClose={hideEligibilityModal}
          eligibility={eligibility}
          facilityDetails={facilityDetails}
        />
      )}
    </div>
  );
}

function mapStateToProps(state) {
  return getFacilityPageV2Info(state);
}

const mapDispatchToProps = {
  openFacilityPageV2: actions.openFacilityPageV2,
  updateFormData: actions.updateFormData,
  hideEligibilityModal: actions.hideEligibilityModal,
  routeToNextAppointmentPage: actions.routeToNextAppointmentPage,
  routeToPreviousAppointmentPage: actions.routeToPreviousAppointmentPage,
  checkEligibility: actions.checkEligibility,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(VAFacilityPageV2);
