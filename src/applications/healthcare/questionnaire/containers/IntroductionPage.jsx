import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import OMBInfo from '@department-of-veterans-affairs/formation-react/OMBInfo';
import Telephone, {
  CONTACTS,
} from '@department-of-veterans-affairs/formation-react/Telephone';

import { focusElement } from 'platform/utilities/ui';
import FormTitle from 'platform/forms-system/src/js/components/FormTitle';
import SaveInProgressIntro from 'platform/forms/save-in-progress/SaveInProgressIntro';

const IntroductionPage = props => {
  useEffect(() => {
    focusElement('.va-nav-breadcrumbs-list');
  }, []);
  const { appointment } = props?.questionnaire?.context;
  const facilityName = appointment?.vdsAppointments
    ? appointment?.vdsAppointments[0]?.clinic?.facility?.displayName
    : '';
  return (
    <div className="schemaform-intro healthcare-experience">
      <FormTitle title="Upcoming appointment questionnaire" />
      <h2 className="sub-heading">{facilityName}</h2>
      <p className="better-prepare-yours">
        Better prepare yourself and your provider for your upcoming appointment
        with this questionnaire.
      </p>
      <SaveInProgressIntro
        hideUnauthedStartLink
        prefillEnabled={props.route.formConfig.prefillEnabled}
        messages={props.route.formConfig.savedFormMessages}
        pageList={props.route.pageList}
        startText="Start the questionnaire"
      >
        Please complete the HC-QSTNR form to apply for Upcoming Visit
        questionnaire.
      </SaveInProgressIntro>
      <section>
        <h3 className="urgent-needs-header">
          Can I use this questionnaire for medical emergencies or urgent needs?
        </h3>
        <p>
          If you think you have a medical emergency, call 911 or go to the
          nearest emergency room.
        </p>
        <p>
          If you don’t have an emergency, but you’re not sure what type of care
          you need, call your nearest VA health facility.
        </p>
        <p>
          <a href="/find-locations/">Find your nearest VA health facility</a>
        </p>
        <p>
          If you need to talk to someone right away, contact the Veterans Crisis
          Line. Whatever you’re struggling with—chronic pain, anxiety,
          depression, trouble sleeping, anger, or even homelessness—we can
          support you. Out Veterans Crisis Line is confidential (private), free,
          and available 24/7.
        </p>
        <section>
          <header>
            To connect with a Veterans Crisis Line responder anytime, day or
            night:
          </header>
          <ul>
            <li>
              Call the Veterans Crisis Line at{' '}
              <Telephone contact={CONTACTS.CRISIS_LINE} /> and press 1, or
            </li>
            <li>
              Start a
              <a href="https://www.veteranscrisisline.net/ChatTermsOfService.aspx?account=Veterans%20Chat/">
                confidential Veteran chat
              </a>{' '}
              ,or
            </li>
            <li>
              Text <a href="sms:838255">838255</a>.
            </li>
          </ul>
        </section>
      </section>
      <section>
        <h3 className="personal-info-header">
          How will my personal health information be protected and shared if I
          use this questionnaire?
        </h3>
        <p>
          The information that you enter will be shared with your provider and
          added to your medical record. After it becomes part of your medical
          record, all VA providers will be able to view this information. You’ll
          have until [time period] before your upcoming appointment to submit
          this questionnaire.
        </p>
        <p>
          This is a secure website. We follow strict security policies and
          practices to protect your personal health information.
        </p>
      </section>
      <h3>
        Follow the steps below to complete the upcoming appointment
        questionnaire.
      </h3>
      <div className="process schemaform-process">
        <ol>
          <li className="process-step list-one">
            <h4>Prepare</h4>
            <ul>
              <li>
                Think through any health concerns or life events that are
                positively or negatively affecting your health (e.g. marriage,
                divorce, new job, retirement, parenthood, or finances).
              </li>
              <li>
                Create a list of questions that you want to ask your provider at
                your upcoming appointment.
              </li>
            </ul>
          </li>
          <li className="process-step list-two">
            <h4>Fill out upcoming appointment information</h4>
            <p>
              Complete the questionnaire [some time period] before your
              appointment. After submitting, your information will be securely
              sent to your provider to review prior to your appointment. It will
              also be added to your medical record. Printing a copy isn’t
              required, but you can print a copy for your records if you want.
            </p>
          </li>
          <li className="process-step list-three">
            <h4>Attend your upcoming appointment</h4>
            <p>
              Your appointment is where your provider will discuss the
              information you entered with you in more detail.
            </p>
          </li>
        </ol>
      </div>
      <SaveInProgressIntro
        buttonOnly
        messages={props.route.formConfig.savedFormMessages}
        pageList={props.route.pageList}
        startText="Start the questionnaire"
      />
      <div className="omb-info--container" style={{ paddingLeft: '0px' }}>
        <OMBInfo ombNumber="0000-0000" expDate="mm/dd/yyyy" />
      </div>
    </div>
  );
};

const mapStateToProps = state => {
  return {
    questionnaire: state?.questionnaireData,
  };
};

export default connect(
  mapStateToProps,
  null,
)(IntroductionPage);
