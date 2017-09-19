import React from 'react';
import PropTypes from 'prop-types';
import omit from 'lodash/omit';
import { toastr } from 'react-redux-toastr';

// Service
import DatasetsService from 'services/DatasetsService';

import { STATE_DEFAULT, FORM_ELEMENTS } from 'components/datasets/form/constants';

import Navigation from 'components/form/Navigation';
import Step1 from 'components/datasets/form/steps/Step1';
import Spinner from 'components/ui/Spinner';

class DatasetsForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = Object.assign({}, STATE_DEFAULT, {
      loading: !!props.dataset,
      columns: [],
      form: Object.assign({}, STATE_DEFAULT.form, {
        application: props.application,
        authorization: props.authorization
      })
    });

    this.service = new DatasetsService({
      authorization: props.authorization
    });

    // BINDINGS
    this.onSubmit = this.onSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onStepChange = this.onStepChange.bind(this);
  }

  componentDidMount() {
    // Get the dataset and fill the
    // state with its params if it exists
    if (this.props.dataset) {
      this.service.fetchData({ id: this.props.dataset })
        .then((data) => {
          const { provider, tableName } = data || {};
          this.setState({
            form: this.setFormFromParams(data),
            // Stop the loading
            loading: false
          });

          this.service.fetchFields({
            id: this.props.dataset,
            provider,
            tableName
          })
            .then((columns) => {
              this.setState({
                columns
              });
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

  /**
   * UI EVENTS
   * - onSubmit
   * - onChange
  */
  onSubmit(event) {
    event.preventDefault();

    // Validate the form
    FORM_ELEMENTS.validate(this.state.step);

    // Set a timeout due to the setState function of react
    setTimeout(() => {
      // Validate all the inputs on the current step
      const valid = FORM_ELEMENTS.isValid(this.state.step);

      if (valid) {
        // if we are in the last step we will submit the form
        if (this.state.step === this.state.stepLength && !this.state.submitting) {
          const dataset = this.props.dataset;

          // Start the submitting
          this.setState({ submitting: true });

          // Set the request
          const requestOptions = {
            type: (dataset) ? 'PATCH' : 'POST',
            omit: (dataset) ? ['connectorUrlHint', 'authorization', 'connectorType', 'provider'] : ['connectorUrlHint', 'authorization']
          };

          // Save the data
          this.service.saveData({
            type: requestOptions.type,
            id: dataset,
            body: omit(this.state.form, requestOptions.omit)
          })
            .then((data) => {
              toastr.success('Success', `The dataset "${data.id}" - "${data.name}" has been uploaded correctly`);
              if (this.props.onSubmit) {
                this.props.onSubmit();
              }
            })
            .catch((err) => {
              this.setState({ submitting: false });
              try {
                if (err && !!err.length) {
                  err.forEach((e) => {
                    toastr.error('Error', e.detail);
                  });
                } else {
                  toastr.error('Error', 'Oops! There was an error, try again');
                }
              } catch (e) {
                toastr.error('Error', 'Oops! There was an error, try again');
              }
            });
        } else {
          this.setState({
            step: this.state.step + 1
          });
        }
      } else {
        toastr.error('Error', 'Fill all the required fields or correct the invalid values');
      }
    }, 0);
  }

  onChange(obj) {
    const form = Object.assign({}, this.state.form, obj);
    this.setState({ form });
  }

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
      <form className="c-form" onSubmit={this.onSubmit} noValidate>
        <Spinner isLoading={this.state.loading} className="-light" />

        {(this.state.step === 1 && !this.state.loading) &&
          <Step1
            onChange={value => this.onChange(value)}
            basic={this.props.basic}
            form={this.state.form}
            dataset={this.props.dataset}
            columns={this.state.columns}
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
    );
  }
}

DatasetsForm.propTypes = {
  application: PropTypes.array,
  authorization: PropTypes.string,
  dataset: PropTypes.string,
  basic: PropTypes.bool,
  onSubmit: PropTypes.func
};

export default DatasetsForm;
