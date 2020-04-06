import React from 'react';
import sinon from 'sinon';
import { mount } from 'enzyme';

import {
  DefinitionTester,
  fillData,
} from '../../../../../platform/testing/unit/schemaform-utils.jsx';
import formConfig from '../../../feedback-tool/config/form';

describe('feedback tool applicant info', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.applicantInformation.pages.contactInformation;

  test('should render', () => {
    const form = mount(
      <DefinitionTester
        schema={schema}
        data={{}}
        definitions={formConfig.defaultDefinitions}
        uiSchema={uiSchema}
      />,
    );

    expect(form.find('input').length).toBe(7);
    form.unmount();
  });

  test('should not submit without required information', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        schema={schema}
        definitions={formConfig.defaultDefinitions}
        onSubmit={onSubmit}
        uiSchema={uiSchema}
      />,
    );

    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error').length).toBe(6);
    expect(onSubmit.called).toBe(false);
    form.unmount();
  });

  test('should submit with required information', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        schema={schema}
        definitions={formConfig.defaultDefinitions}
        onSubmit={onSubmit}
        uiSchema={uiSchema}
      />,
    );

    fillData(form, 'input#root_address_street', 'test');
    fillData(form, 'input#root_address_street2', 'test');
    fillData(form, 'input#root_address_city', 'test');
    const state = form.find('select#root_address_state');
    state.simulate('change', {
      target: { value: 'CA' }, // TODO: update with new schema
    });
    const country = form.find('select#root_address_country');
    country.simulate('change', {
      target: { value: 'US' },
    });
    fillData(form, 'input#root_address_postalCode', '12312');
    fillData(form, 'input#root_applicantEmail', 'test@test.com');
    fillData(
      form,
      'input[name="root_view:applicantEmailConfirmation"]',
      'test@test.com',
    );
    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error').length).toBe(0);
    expect(onSubmit.called).toBe(true);
    form.unmount();
  });
});
