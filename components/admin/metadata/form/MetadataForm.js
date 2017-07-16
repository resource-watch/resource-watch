import React from 'react';
import omit from 'lodash/omit';

import { Autobind } from 'es-decorators';

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
        .then((data) => {
          const metadata = data.attributes.metadata;

          this.setState({
            form: (metadata && metadata.length) ?
              this.setFormFromParams(metadata[0].attributes) :
              this.state.form,
            metadata,
            // Stop the loading
            loading: false
          });
        })
        .catch((err) => {
          this.setState({ loading: false });
          console.error(err);
        });

      this.service.fetchFields({ id: this.props.dataset })
        .then((data) => {
          this.setState({
            columns: data
          });
        })
        .catch((err) => {
          console.error(err);
        });
    }
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

        console.log(omit(this.state.form, requestOptions.omit));
        debugger;
        // Save the data
        this.service.saveMetadata({
          type: requestOptions.type,
          id: dataset,
          body: omit(this.state.form, requestOptions.omit)
        })
          .then(() => {
            const successMessage = 'Metadata has been uploaded correctly';
            alert(successMessage);

            this.props.onSubmit && this.props.onSubmit();
          })
          .catch((err) => {
            this.setState({ submitting: false });
            console.error(err);
          });
      }
    }, 0);
  }

  @Autobind
  onChange(obj) {
    const form = Object.assign({}, this.state.form, obj.form);
    this.setState({ form });
    console.info(form);
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
  dataset: React.PropTypes.string.isRequired,
  application: React.PropTypes.string.isRequired,
  authorization: React.PropTypes.string.isRequired,
  onSubmit: React.PropTypes.func
};

export default MetadataForm;
