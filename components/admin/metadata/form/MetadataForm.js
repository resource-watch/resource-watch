import React from 'react';
import PropTypes from 'prop-types';
import omit from 'lodash/omit';
import { toastr } from 'react-redux-toastr';

import { Autobind } from 'es-decorators';

// redux
import { connect } from 'react-redux';

// redactions
import { setSources, resetSources } from 'redactions/admin/sources';

// Service
import DatasetsService from 'services/DatasetsService';

// Contants
import { STATE_DEFAULT, FORM_ELEMENTS } from 'components/admin/metadata/form/constants';

// Components
import Navigation from 'components/form/Navigation';
import Step1 from 'components/admin/metadata/form/steps/Step1';


class MetadataForm extends React.Component {
  constructor(props) {
    super(props);

    const newState = Object.assign({}, STATE_DEFAULT, {
      metadata: [],
      columns: [],
      loading: !!props.dataset,
      form: Object.assign({}, STATE_DEFAULT.form, {
        application: props.application,
        authorization: props.authorization
      })
    });

    this.service = new DatasetsService({
      authorization: props.authorization
    });

    this.state = newState;
  }

  componentDidMount() {
    if (this.props.dataset) {
      this.service.fetchData({ id: this.props.dataset, includes: 'metadata' })
        .then(({ metadata, type, provider, tableName }) => {
          this.setState({
            form: (metadata && metadata.length) ?
              this.setFormFromParams(metadata[0].attributes) :
              this.state.form,
            metadata,
            type: type || 'tabular',
            // Stop the loading
            loading: false
          });

          this.props.setSources((metadata[0] || {}).attributes.info.sources || []);

          // fetchs column fields based on dataset type
          this.service.fetchFields({
            id: this.props.dataset,
            provider,
            tableName
          })
            .then((columns) => {
              this.setState({ columns });
            })
            .catch((err) => {
              toastr.error('Error', err);
            });
        })
        .catch((err) => {
          this.setState({ loading: false });
          toastr.error('Error', err);
        });
    }
  }

  componentWillUnmount() {
    this.props.resetSources();
  }

  /**
   * UI EVENTS
   * - onSubmit
   * - onChange
  */
  @Autobind
  onSubmit(event) {
    event.preventDefault();

    // Validate the form
    FORM_ELEMENTS.validate();

    // Set a timeout due to the setState function of react
    setTimeout(() => {
      const valid = FORM_ELEMENTS.isValid();
      if (valid) {
        const { dataset } = this.props;
        const { metadata, form } = this.state;

        // Start the submitting
        this.setState({ submitting: true });

        // Check if the metadata alerady exists
        const thereIsMetadata = Boolean(metadata.find((m) => {
          const hasLang = m.attributes.language === form.language;
          const hasApp = m.attributes.application === form.application;

          return hasLang && hasApp;
        }));

        // Set the request
        const requestOptions = {
          type: (dataset && thereIsMetadata) ? 'PATCH' : 'POST',
          omit: ['authorization']
        };

        // Save the data
        this.service.saveMetadata({
          type: requestOptions.type,
          id: dataset,
          body: omit(this.state.form, requestOptions.omit)
        })
          .then(() => {
            toastr.success('Success', 'Metadata has been uploaded correctly');
            if (this.props.onSubmit) {
              this.props.onSubmit();
            }
          })
          .catch((err) => {
            this.setState({ submitting: false });
            toastr.error('Error', err);
          });
      } else {
        toastr.error('Error', 'Fill all the required fields or correct the invalid values');
      }
    }, 0);
  }

  @Autobind
  onChange(obj) {
    const form = Object.assign({}, this.state.form, obj.form);
    this.setState({ form });
  }

  @Autobind
  onStepChange(step) {
    this.setState({ step });
  }

  // HELPERS
  setFormFromParams(params) {
    const form = Object.keys(this.state.form);
    const newForm = {};

    form.forEach((f) => {
      if (params[f] || this.state.form[f]) {
        newForm[f] = params[f] || this.state.form[f];
      }
    });

    return newForm;
  }

  render() {
    return (
      <div className="c-metadata-form">
        <form className="c-form" onSubmit={this.onSubmit} noValidate>
          {this.state.loading && 'loading'}
          {!this.state.loading &&
            <Step1
              onChange={value => this.onChange(value)}
              columns={this.state.columns}
              type={this.state.type}
              form={this.state.form}
            />
          }

          {!this.state.loading &&
            <Navigation
              step={this.state.step}
              stepLength={this.state.stepLength}
              submitting={this.state.submitting}
              onStepChange={this.onStepChange}
            />
          }
        </form>
      </div>
    );
  }
}

MetadataForm.propTypes = {
  dataset: PropTypes.string.isRequired,
  application: PropTypes.string.isRequired,
  authorization: PropTypes.string.isRequired,
  onSubmit: PropTypes.func
};

const mapStateToProps = () => ({});

const mapDispatchToProps = dispatch => ({
  setSources: sources => dispatch(setSources(sources)),
  resetSources: () => dispatch(resetSources())
});

export default connect(mapStateToProps, mapDispatchToProps)(MetadataForm);
