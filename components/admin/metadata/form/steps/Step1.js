import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import isEqual from 'lodash/isEqual';
import compact from 'lodash/compact';

// redux
import { connect } from 'react-redux';


// redactions
import { setSources } from 'redactions/admin/sources';

// actions
import { toggleModal } from 'redactions/modal';

// components
import Field from 'components/form/Field';
import Input from 'components/form/Input';
import Select from 'components/form/SelectInput';
import TextArea from 'components/form/TextArea';
import Title from 'components/ui/Title';
import Spinner from 'components/ui/Spinner';
import SourcesContentModal from 'components/admin/metadata/form/SourcesContentModal';

// constants
import { FORM_ELEMENTS, LANGUAGE_OPTIONS, RASTER_COLUMN_TYPES } from 'components/admin/metadata/form/constants';

class Step1 extends React.Component {
  componentWillReceiveProps(nextProps) {
    if (!isEqual(this.props.sources, nextProps.sources)) {
      this.changeMetadata({ info: { sources: nextProps.sources } });
    }
  }

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

  openSourcesModal() {
    this.props.toggleModal(true, {
      children: SourcesContentModal,
      childrenProps: {
        onClose: () => this.props.toggleModal(false, {}),
        onSubmit: () => this.props.toggleModal(false, {})
      }
    });
  }

  render() {
    const { form, columns, type, sources, loadingColumns } = this.props;
    const isRaster = type === 'raster';

    const aliasColumnClass = classnames('columns', {
      'small-2': isRaster,
      'small-5': !isRaster
    });

    const descriptionColumnClass = classnames('columns', {
      'small-4': isRaster,
      'small-5': !isRaster
    });

    return (
      <div>
        <fieldset className="c-field-container">
          <Title className="-big -secondary">
            Edit metadata
          </Title>

          <Title className="-default -secondary">
            General
          </Title>

          <Field
            ref={(c) => { if (c) FORM_ELEMENTS.elements.name = c; }}
            onChange={value => this.changeMetadata({ info: { name: value } })}
            validations={['required']}
            hint="Max length of 75 characters"
            properties={{
              name: 'name',
              label: 'Title',
              type: 'text',
              maxLength: '75',
              required: true,
              default: this.props.form.info.name
            }}
          >
            {Input}
          </Field>

          <Field
            ref={(c) => { if (c) FORM_ELEMENTS.elements.subtitle = c; }}
            onChange={value => this.changeMetadata({ subtitle: value })}
            properties={{
              name: 'subtitle',
              label: 'Subtitle',
              type: 'text',
              default: this.props.form.subtitle
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

          {/* Resource Watch ID */}
          <Field
            ref={(c) => { if (c) FORM_ELEMENTS.elements.rwId = c; }}
            onChange={value => this.changeMetadata({ info: { rwId: value } })}
            validations={[]}
            properties={{
              name: 'rwId',
              label: 'Resource Watch ID',
              type: 'text',
              required: false,
              default: this.props.form.info.rwId
            }}
          >
            {Input}
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
              default: this.props.form.language || 'en',
              instanceId: 'selectLanguage'
            }}
          >
            {Select}
          </Field>

        </fieldset>

        <fieldset className="c-field-container">
          <Title className="-default -secondary">
            Data info
          </Title>

          <Field
            ref={(c) => { if (c) FORM_ELEMENTS.elements.technical_title = c; }}
            onChange={value => this.changeMetadata({ info: { technical_title: value } })}
            validations={['required']}
            properties={{
              name: 'technical_title',
              label: 'Technical title',
              type: 'text',
              required: true,
              default: this.props.form.info.technical_title
            }}
          >
            {Input}
          </Field>
          <Field
            ref={(c) => { if (c) FORM_ELEMENTS.elements.functions = c; }}
            onChange={value => this.changeMetadata({ info: { functions: value } })}
            hint="Briefly describes the purpose of the data and what it represents. Max length of 200 characters"
            properties={{
              name: 'functions',
              label: 'Function',
              type: 'text',
              rows: '6',
              maxLength: '200',
              default: this.props.form.info.functions
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

          <button
            className="c-button -primary"
            type="button"
            onClick={() => this.openSourcesModal()}
          >
            Add/Remove sources
          </button>

          {sources.length > 0 &&
            <div className="c-metadata-source-list">
              <ul className="source-list">
                {compact(sources).map(source =>
                  (<li key={source.id} className="source-item">
                    <div className="source-container">
                      <a
                        className="source-name"
                        href={source['source-name']}
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        {source['source-name']}
                      </a>
                      {source['source-description'] &&
                        <span className="source-description">{source['source-description']}</span>}
                    </div>
                  </li>))
                }
              </ul>

            </div>}

        </fieldset>

        <fieldset className="c-field-container">
          <Title className="-default -secondary">
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
          <Title className="-default -secondary">
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
            ref={(c) => { if (c) FORM_ELEMENTS.elements.data_download_original_link = c; }}
            onChange={value =>
              this.changeMetadata({ info: { data_download_original_link: value } })}
            validations={['url']}
            properties={{
              name: 'data_download_original_link',
              label: 'Download from Original Source link',
              type: 'text',
              default: this.props.form.info.data_download_original_link
            }}
          >
            {Input}
          </Field>
        </fieldset>

        <fieldset className="c-field-container">
          <Title className="-default -secondary">
              Columns
          </Title>

          {loadingColumns &&
            <Spinner className="-inline" isLoading={loadingColumns} />
          }

          {!loadingColumns && !columns.length &&
            <p>No columns</p>
          }

          {!!columns.length &&
            <div className="c-field-row">
              {columns.map(column => (
                <div key={column.name} className="l-row row">
                  <div className="columns small-2">
                    <Field
                      properties={{
                        name: 'column_name',
                        label: 'Column name',
                        type: 'text',
                        disabled: true,
                        readOnly: true,
                        default: column.name
                      }}
                    >
                      {Input}
                    </Field>
                  </div>

                  <div className={aliasColumnClass}>
                    <Field
                      ref={(c) => {
                        if (c) FORM_ELEMENTS.elements[`columns_${column.name}_alias`] = c;
                      }}
                      onChange={(value) => {
                        this.changeMetadata({
                          columns: {
                            ...form.columns,
                            [column.name]: {
                              ...form.columns[column.name],
                              alias: value
                            }
                          }
                        });
                      }}
                      properties={{
                        name: 'alias',
                        label: 'Alias',
                        type: 'text',
                        default: (this.props.form.columns[column.name]) ? this.props.form.columns[column.name].alias : ''
                      }}
                    >
                      {Input}
                    </Field>
                  </div>

                  <div className={descriptionColumnClass}>
                    <Field
                      ref={(c) => {
                        if (c) FORM_ELEMENTS.elements[`columns_${column.name}_description`] = c;
                      }}
                      onChange={(value) => {
                        this.changeMetadata({
                          columns: {
                            ...form.columns,
                            [column.name]: {
                              ...form.columns[column.name],
                              description: value
                            }
                          }
                        });
                      }}

                      properties={{
                        name: 'description',
                        label: 'Description',
                        type: 'text',
                        default: (this.props.form.columns[column.name]) ? this.props.form.columns[column.name].description : ''
                      }}
                    >
                      {Input}
                    </Field>
                  </div>

                  {isRaster &&
                    <div className="columns small-4">
                      <Field
                        ref={(columnType) => {
                          if (columnType) FORM_ELEMENTS.elements[`columns_${column.name}_type`] = columnType;
                        }}
                        onChange={(columnType) => {
                          this.changeMetadata({
                            columns: {
                              ...form.columns,
                              [column.name]: {
                                ...form.columns[column.name],
                                type: columnType
                              }
                            }
                          });
                        }}
                        validations={['required']}
                        options={RASTER_COLUMN_TYPES}
                        properties={{
                          name: 'type',
                          label: 'Type',
                          default: (this.props.form.columns[column.name]) ? this.props.form.columns[column.name].type : 'continuous'
                        }}
                      >
                        {Select}
                      </Field>
                    </div>
                  }
                </div>
              ))}
            </div>
          }
        </fieldset>
      </div>
    );
  }
}

Step1.propTypes = {
  form: PropTypes.object,
  columns: PropTypes.array,
  type: PropTypes.string,
  loadingColumns: PropTypes.bool,
  onChange: PropTypes.func,
  toggleModal: PropTypes.func
};

Step1.defaultProps = {
  type: 'tabular'
};

const mapStateToProps = state => ({
  sources: state.sources.sources
});

const mapDispatchToProps = dispatch => ({
  toggleModal: (open, options) => dispatch(toggleModal(open, options)),
  setSources: sources => dispatch(setSources(sources))
});

export default connect(mapStateToProps, mapDispatchToProps)(Step1);
