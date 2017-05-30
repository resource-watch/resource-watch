import React from 'react';

import { FORM_ELEMENTS, LANGUAGE_OPTIONS } from '../constants';

import Field from 'components/form/Field';
import Input from 'components/form/Input';
import Select from 'components/form/SelectInput';
import TextArea from 'components/form/TextArea';
import Checkbox from 'components/form/Checkbox';
import Title from 'components/ui/Title';

class Step1 extends React.Component {

  changeMetadata(obj) {
    const { form } = this.props;
    let newMetadata;

    if (obj.info) {
      const info = { ...form.info, ...obj.info };
      newMetadata = { ...form, ...{ info } };
    } else {
      newMetadata = { ...form, ...obj };
    }

    this.props.onChange({ form: newMetadata });
  }

  render() {
    return (
      <div>
        <fieldset className="c-field-container">
          <Title className="-default">
            Global
          </Title>

          <Field
            ref={(c) => { if (c) FORM_ELEMENTS.elements.name = c; }}
            onChange={value => this.changeMetadata({ name: value })}
            validations={['required']}
            properties={{
              name: 'name',
              label: 'Title',
              type: 'text',
              required: true,
              default: this.props.form.name
            }}
          >
            {Input}
          </Field>

          <Field
            ref={(c) => { if (c) FORM_ELEMENTS.elements.description = c; }}
            onChange={value => this.changeMetadata({ description: value })}
            validations={['required']}
            properties={{
              name: 'description',
              label: 'Description',
              rows: '6',
              required: true,
              default: this.props.form.description
            }}
          >
            {TextArea}
          </Field>

          <Field
            ref={(c) => { if (c) FORM_ELEMENTS.elements.language = c; }}
            onChange={value => this.changeMetadata({ language: value })}
            validations={['required']}
            options={LANGUAGE_OPTIONS}
            properties={{
              name: 'language',
              label: 'Data language',
              type: 'text',
              disabled: true,
              required: true,
              default: this.props.form.language,
              instanceId: 'selectLanguage'
            }}
          >
            {Select}
          </Field>

          <Field
            ref={(c) => { if (c) FORM_ELEMENTS.elements.wri_funded = c; }}
            onChange={value => this.changeMetadata({ info: { wri_funded: value.checked } })}
            properties={{
              name: 'wri_funded',
              label: 'WRI funded',
              title: 'Is this dataset funded by WRI?',
              checked: this.props.form.info.wri_funded
            }}
          >
            {Checkbox}
          </Field>
        </fieldset>

        <fieldset className="c-field-container">
          <Title className="-default">
            Contact
          </Title>

          <Field
            ref={(c) => { if (c) FORM_ELEMENTS.elements.contact_person_name = c; }}
            onChange={value => this.changeMetadata({ info: { contact_person_name: value } })}
            properties={{
              name: 'contact_person_name',
              label: 'Contact Person Name',
              type: 'text',
              default: this.props.form.info.contact_person_name
            }}
          >
            {Input}
          </Field>

          <Field
            ref={(c) => { if (c) FORM_ELEMENTS.elements.contact_person_email = c; }}
            onChange={value => this.changeMetadata({ info: { contact_person_email: value } })}
            validations={['email']}
            properties={{
              name: 'contact_person_email',
              label: 'Contact Person Email',
              type: 'text',
              default: this.props.form.info.contact_person_email
            }}
          >
            {Input}
          </Field>

        </fieldset>

        <fieldset className="c-field-container">
          <Title className="-default">
            Data info
          </Title>

          <Field
            ref={(c) => { if (c) FORM_ELEMENTS.elements.function = c; }}
            onChange={value => this.changeMetadata({ info: { function: value } })}
            hint="Briefly describes the purpose of the data and what it represents"
            properties={{
              name: 'function',
              label: 'Function',
              type: 'text',
              rows: '6',
              default: this.props.form.info.function
            }}
          >
            {TextArea}
          </Field>

          <Field
            ref={(c) => { if (c) FORM_ELEMENTS.elements.cautions = c; }}
            onChange={value => this.changeMetadata({ info: { cautions: value } })}
            hint="Describes any limitations of the data set that users should be aware of."
            properties={{
              name: 'cautions',
              label: 'Cautions',
              type: 'text',
              rows: '6',
              default: this.props.form.info.cautions
            }}
          >
            {TextArea}
          </Field>

          <Field
            ref={(c) => { if (c) FORM_ELEMENTS.elements.citation = c; }}
            onChange={value => this.changeMetadata({ info: { citation: value } })}
            hint="Unless otherwise specified on Data Sharing Agreement, format should be: Organization name. “Official data layer name as in the ODP.” Accessed through Resource Watch [date]. www.resourcewatch.org (should always end with: Accessed through Resource Watch on [date]. www.resourcewatch.org)"
            properties={{
              name: 'citation',
              label: 'Citation',
              type: 'text',
              rows: '6',
              default: this.props.form.info.citation
            }}
          >
            {TextArea}
          </Field>

          <Field
            ref={(c) => { if (c) FORM_ELEMENTS.elements.geographic_coverage = c; }}
            onChange={value => this.changeMetadata({ info: { geographic_coverage: value } })}
            hint="Describes the spatial extent of the data set (Note: if Global, write Global. If for a select group of countries, list countries in alphabetical order, use Oxford comma, and include 'the' in country names, e.g., Republic of the Congo)"
            properties={{
              name: 'geographic_coverage',
              label: 'Geographic Coverage',
              type: 'text',
              rows: '6',
              default: this.props.form.info.geographic_coverage
            }}
          >
            {TextArea}
          </Field>


          <Field
            ref={(c) => { if (c) FORM_ELEMENTS.elements.spatial_resolution = c; }}
            onChange={value => this.changeMetadata({ info: { spatial_resolution: value } })}
            hint="Describes the spatial resolution, e.g., 50 meters (50 m in parentheses), 500 × 500 meters (note use of times symbol instead of x), 15 arc second/minute/degree"
            properties={{
              name: 'spatial_resolution',
              label: 'Spatial Resolution',
              type: 'text',
              rows: '6',
              default: this.props.form.info.spatial_resolution
            }}
          >
            {TextArea}
          </Field>

          <Field
            ref={(c) => { if (c) FORM_ELEMENTS.elements.date_of_content = c; }}
            onChange={value => this.changeMetadata({ info: { date_of_content: value } })}
            hint="Date or time period that the data represents (Select the finest level of content - yearly, monthly, weekly, daily - and Other. Under other list the years for which data is available using four digits, separated by a space and a comma, e.g. 2005, 2010, 2015)"
            properties={{
              name: 'date_of_content',
              label: 'Date of Content',
              type: 'text',
              default: this.props.form.info.date_of_content
            }}
          >
            {Input}
          </Field>

          <Field
            ref={(c) => { if (c) FORM_ELEMENTS.elements.frequency_of_updates = c; }}
            onChange={value => this.changeMetadata({ info: { frequency_of_updates: value } })}
            hint="Describes how frequently the data set is updated"
            properties={{
              name: 'frequency_of_updates',
              label: 'Frequency of Updates',
              type: 'text',
              default: this.props.form.info.frequency_of_updates
            }}
          >
            {Input}
          </Field>

          <Field
            ref={(c) => { if (c) FORM_ELEMENTS.elements.scientific_paper = c; }}
            onChange={value => this.changeMetadata({ info: { scientific_paper: value } })}
            properties={{
              name: 'scientific_paper',
              label: 'Scientific Paper',
              type: 'text',
              default: this.props.form.info.scientific_paper
            }}
          >
            {Input}
          </Field>

          <Field
            ref={(c) => { if (c) FORM_ELEMENTS.elements.license = c; }}
            onChange={value => this.changeMetadata({ info: { license: value } })}
            hint="License under which data are published"
            properties={{
              name: 'license',
              label: 'License',
              type: 'text',
              default: this.props.form.info.license
            }}
          >
            {Input}
          </Field>

          <Field
            ref={(c) => { if (c) FORM_ELEMENTS.elements.license_link = c; }}
            onChange={value => this.changeMetadata({ info: { license_link: value } })}
            validations={['url']}
            properties={{
              name: 'license_link',
              label: 'License link',
              type: 'text',
              default: this.props.form.info.license_link
            }}
          >
            {Input}
          </Field>


          <Field
            ref={(c) => { if (c) FORM_ELEMENTS.elements.source_organization = c; }}
            onChange={value => this.changeMetadata({ info: { source_organization: value } })}
            properties={{
              name: 'source_organization',
              label: 'Source Organization',
              type: 'text',
              default: this.props.form.info.source_organization
            }}
          >
            {Input}
          </Field>

          <Field
            ref={(c) => { if (c) FORM_ELEMENTS.elements.source_organization_link = c; }}
            onChange={value => this.changeMetadata({ info: { source_organization_link: value } })}
            validations={['url']}
            properties={{
              name: 'source_organization_link',
              label: 'Source Organization Link',
              type: 'text',
              default: this.props.form.info.source_organization_link
            }}
          >
            {Input}
          </Field>

        </fieldset>

        <fieldset className="c-field-container">
          <Title className="-default">
            Translated
          </Title>

          <Field
            ref={(c) => { if (c) FORM_ELEMENTS.elements.translated_title = c; }}
            onChange={value => this.changeMetadata({ info: { translated_title: value } })}
            properties={{
              name: 'translated_title',
              label: 'Translated Title',
              type: 'text',
              default: this.props.form.info.translated_title
            }}
          >
            {Input}
          </Field>

          <Field
            ref={(c) => { if (c) FORM_ELEMENTS.elements.translated_function = c; }}
            onChange={value => this.changeMetadata({ info: { translated_function: value } })}
            hint="Briefly describes the purpose of the data and what it represents"
            properties={{
              name: 'translated_function',
              label: 'Translated Function',
              type: 'text',
              rows: '6',
              default: this.props.form.info.translated_function
            }}
          >
            {TextArea}
          </Field>

          <Field
            ref={(c) => { if (c) FORM_ELEMENTS.elements.translated_description = c; }}
            onChange={value => this.changeMetadata({ info: { translated_description: value } })}
            hint="Briefly describes the purpose of the data and what it represents"
            properties={{
              name: 'translated_description',
              label: 'Translated Description',
              type: 'text',
              rows: '6',
              default: this.props.form.info.translated_description
            }}
          >
            {TextArea}
          </Field>

        </fieldset>

        <fieldset className="c-field-container">
          <Title className="-default">
            Links
          </Title>

          <Field
            ref={(c) => { if (c) FORM_ELEMENTS.elements.learn_more_link = c; }}
            onChange={value => this.changeMetadata({ info: { learn_more_link: value } })}
            validations={['url']}
            properties={{
              name: 'learn_more_link',
              label: 'Learn More link',
              type: 'text',
              default: this.props.form.info.learn_more_link
            }}
          >
            {Input}
          </Field>

          <Field
            ref={(c) => { if (c) FORM_ELEMENTS.elements.data_download_link = c; }}
            onChange={value => this.changeMetadata({ info: { data_download_link: value } })}
            validations={['url']}
            properties={{
              name: 'data_download_link',
              label: 'Data Download link',
              type: 'text',
              default: this.props.form.info.data_download_link
            }}
          >
            {Input}
          </Field>

          <Field
            ref={(c) => { if (c) FORM_ELEMENTS.elements.data_visualization_link = c; }}
            onChange={value => this.changeMetadata({ info: { data_visualization_link: value } })}
            validations={['url']}
            properties={{
              name: 'data_visualization_link',
              label: 'Data Visualization link',
              type: 'text',
              default: this.props.form.info.data_visualization_link
            }}
          >
            {Input}
          </Field>
        </fieldset>
      </div>
    );
  }
}

Step1.propTypes = {
  form: React.PropTypes.object,
  onChange: React.PropTypes.func
};

export default Step1;
