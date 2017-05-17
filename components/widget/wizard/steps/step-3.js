import React from 'react';

import Step from '../../form/steps/Step1';
import Field from '../../../form/Field';
import Input from '../../../form/Input';
import Textarea from '../../../form/TextArea';
import Title from '../../../ui/Title';

class Step3 extends Step {

  changeMetadata(obj) {
    const { metadata } = this.props.wizard;
    const newMetadata = Object.assign({}, metadata, obj);

    this.props.onChange({ metadata: newMetadata });
  }

  render() {
    return (
      <fieldset className="c-field-container">
        <Title className="-primary -big">
          Metadata
        </Title>
        <Field
          ref={(c) => { if (c) this.children.push(c); }}
          onChange={value => this.changeMetadata({ technical_title: value })}
          validations={['required']}
          hint="The tech title is the unique id for each RW data set. It refers to the back-end data management name (or the name given to the data in S3, for example 'cmr_logging'). See this doc for more information on technical titles: <a target='_blank' href='https://docs.google.com/document/d/11pOlf4tC47GWPwQOuswclM3-Trc7fEh0oLUxw-QLBag/edit?usp=sharing'>Open file</a>"
          properties={{
            name: 'technical_title',
            label: 'Technical Title',
            type: 'text',
            required: true,
            default: this.props.wizard.metadata.technical_title
          }}
        >
          {Input}
        </Field>

        <Field
          ref={(c) => { if (c) this.children.push(c); }}
          onChange={value => this.changeMetadata({ title: value })}
          hint="The official title for display on RW (see style guidelines: https://docs.google.com/document/d/1GtKycexP43BLWpQ56KZhKSMmidpvd-v4s0ajXCQcW48/edit)"
          properties={{
            name: 'title',
            label: 'Title',
            type: 'text',
            default: this.props.wizard.metadata.title
          }}
        >
          {Input}
        </Field>

        <Field
          ref={(c) => { if (c) this.children.push(c); }}
          onChange={value => this.changeMetadata({ subtitle: value })}
          hint="If the title should have a description include it here (e.g., annual, 30m, global, Hansen/UMD/Google/USGS/NASA)"
          properties={{
            name: 'subtitle',
            label: 'Subtitle',
            type: 'text',
            default: this.props.wizard.metadata.subtitle
          }}
        >
          {Input}
        </Field>

        <Field
          ref={(c) => { if (c) this.children.push(c); }}
          onChange={value => this.changeMetadata({ source: value })}
          hint="People/organizations that contributed to the data set (separate by commas), or link to the journal article"
          properties={{
            name: 'source',
            label: 'Source',
            type: 'text',
            default: this.props.wizard.metadata.source
          }}
        >
          {Input}
        </Field>

        <Field
          ref={(c) => { if (c) this.children.push(c); }}
          onChange={value => this.changeMetadata({ functions: value })}
          hint="Briefly describes the purpose of the data and what it represents"
          properties={{
            name: 'functions',
            label: 'Function',
            type: 'text',
            default: this.props.wizard.metadata.functions
          }}
        >
          {Textarea}
        </Field>

        <Field
          ref={(c) => { if (c) this.children.push(c); }}
          onChange={value => this.changeMetadata({ geographic_coverage: value })}
          hint="Describes the spatial extent of the data set (Note: if Global, write Global. If for a select group of countries, list countries in alphabetical order, use Oxford comma, and include 'the' in country names, e.g., Republic of the Congo)"
          properties={{
            name: 'geographic_coverage',
            label: 'Geographic Coverage',
            type: 'text',
            default: this.props.wizard.metadata.geographic_coverage
          }}
        >
          {Input}
        </Field>


        <Field
          ref={(c) => { if (c) this.children.push(c); }}
          onChange={value => this.changeMetadata({ spatial_resolution: value })}
          hint="Describes the spatial resolution, e.g., 50 meters (50 m in parentheses), 500 × 500 meters (note use of times symbol instead of x), 15 arc second/minute/degree"
          properties={{
            name: 'spatial_resolution',
            label: 'Spatial Resolution',
            type: 'text',
            default: this.props.wizard.metadata.spatial_resolution
          }}
        >
          {Input}
        </Field>

        <Field
          ref={(c) => { if (c) this.children.push(c); }}
          onChange={value => this.changeMetadata({ date_of_content: value })}
          hint="Date or time period that the data represents (Select the finest level of content - yearly, monthly, weekly, daily - and Other. Under other list the years for which data is available using four digits, separated by a space and a comma, e.g. 2005, 2010, 2015)"
          properties={{
            name: 'date_of_content',
            label: 'Date of Content',
            type: 'text',
            default: this.props.wizard.metadata.date_of_content
          }}
        >
          {Input}
        </Field>

        <Field
          ref={(c) => { if (c) this.children.push(c); }}
          onChange={value => this.changeMetadata({ frequency_of_updates: value })}
          hint="Describes how frequently the data set is updated"
          properties={{
            name: 'frequency_of_updates',
            label: 'Frequency of Updates',
            type: 'text',
            default: this.props.wizard.metadata.frequency_of_updates
          }}
        >
          {Input}
        </Field>

        <Field
          ref={(c) => { if (c) this.children.push(c); }}
          onChange={value => this.changeMetadata({ cautions: value })}
          hint="Describes any limitations of the data set that users should be aware of. Use a bulleted list if possible."
          properties={{
            name: 'cautions',
            label: 'Cautions',
            type: 'text',
            default: this.props.wizard.metadata.cautions
          }}
        >
          {Textarea}
        </Field>

        <Field
          ref={(c) => { if (c) this.children.push(c); }}
          onChange={value => this.changeMetadata({ license: value })}
          hint="License under which data are published"
          properties={{
            name: 'license',
            label: 'License',
            type: 'text',
            default: this.props.wizard.metadata.license
          }}
        >
          {Input}
        </Field>

        <Field
          ref={(c) => { if (c) this.children.push(c); }}
          onChange={value => this.changeMetadata({ license_link: value })}
          hint="License under which data are published"
          validations={['url']}
          properties={{
            name: 'license_link',
            label: 'Link to License or ToS',
            type: 'text',
            default: this.props.wizard.metadata.license_link
          }}
        >
          {Input}
        </Field>

        <Field
          ref={(c) => { if (c) this.children.push(c); }}
          onChange={value => this.changeMetadata({ overview: value })}
          hint="Description or abstract of the data and methodology. Include links as appropriate, e.g., source data (Landsat, MODIS, etc.), relevant publications, etc."
          properties={{
            name: 'overview',
            label: 'Overview',
            type: 'text',
            default: this.props.wizard.metadata.overview
          }}
        >
          {Textarea}
        </Field>

        <Field
          ref={(c) => { if (c) this.children.push(c); }}
          onChange={value => this.changeMetadata({ why: value })}
          hint="Briefly explain why this data set is being added to the website (e.g, best available for this country, useful for X organization, etc...)"
          properties={{
            name: 'why',
            label: 'Why was this data added to the website?',
            type: 'text',
            default: this.props.wizard.metadata.why
          }}
        >
          {Textarea}
        </Field>

        <Field
          ref={(c) => { if (c) this.children.push(c); }}
          onChange={value => this.changeMetadata({ citation: value })}
          hint="Unless otherwise specified on Data Sharing Agreement, format should be: Organization name. “Official data layer name as in the ODP.” Accessed through Resource Watch [date]. www.resourcewatch.org (should always end with: Accessed through Resource Watch on [date]. www.resourcewatch.org)"
          properties={{
            name: 'citation',
            label: 'Citation',
            type: 'text',
            default: this.props.wizard.metadata.citation
          }}
        >
          {Textarea}
        </Field>

        <Field
          ref={(c) => { if (c) this.children.push(c); }}
          onChange={value => this.changeMetadata({ other: value })}
          hint="If there is a custom field outside the RW metadata standards please enter the text for it here. For example, a 'Tree Cover Density' field for the 2000 tree cover layer."
          properties={{
            name: 'other',
            label: 'Other',
            type: 'text',
            default: this.props.wizard.metadata.other
          }}
        >
          {Textarea}
        </Field>

      </fieldset>
    );
  }
}

Step3.propTypes = {
  wizard: React.PropTypes.object,
  onChange: React.PropTypes.func
};

export default Step3;
