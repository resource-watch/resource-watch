import React from 'react';

// Services
import DatasetsService from 'services/DatasetsService';
import LayersService from 'services/LayersService';

// Constants
import { STATE_DEFAULT, FORM_ELEMENTS } from 'components/admin/layers/form/constants';

// Components
import Step1 from 'components/admin/layers/form/steps/Step1';
import Navigation from 'components/form/Navigation';
import Spinner from 'components/ui/Spinner';

class LayersForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = Object.assign({}, STATE_DEFAULT, {
      id: props.id,
      dataset: props.dataset,
      datasets: [],
      form: Object.assign({}, STATE_DEFAULT.form, {
        application: props.application
      }),
      loading: !!props.id
    });

    // Service
    this.datasetsService = new DatasetsService({
      authorization: props.authorization
    });

    this.service = new LayersService({
      authorization: props.authorization
    });

    // BINDINGS
    this.onSubmit = this.onSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onChangeDataset = this.onChangeDataset.bind(this);
    this.onStepChange = this.onStepChange.bind(this);
  }

  componentWillMount() {
    const { id } = this.state;

    if (!id) {
      this.datasetsService.fetchAllData({
        applications: this.props.application,
        includes: ''
      })
        .then((data) => {
          this.setState({
            datasets: data.sort((a, b) => {
              const nameA = a.name.toLowerCase();
              const nameB = b.name.toLowerCase();

              if (nameA < nameB) return -1;
              if (nameA > nameB) return 1;
              return 0;  //no sorting
            })
          });
        })
        .catch(err => console.error(err));
    }

    if (id) {
      this.service.fetchData({ id })
        .then((data) => {
          this.setState({
            dataset: data.attributes.dataset,
            form: this.setFormFromParams(data.attributes),
            // Stop the loading
            loading: false
          });
        })
        .catch(err => console.error(err));
    }
  }

  /**
   * UI EVENTS
   * - onSubmit
   * - onChange
   * - onChangeDataset
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
          const { id, dataset } = this.state;

          // Start the submitting
          this.setState({ submitting: true });

          this.service.saveData({
            dataset,
            id: id || '',
            type: (id) ? 'PATCH' : 'POST',
            body: { layer: this.state.form }
          })
            .then((data) => {
              const successMessage = `The layer "${data.id}" - "${data.attributes.name}" has been uploaded correctly`;
              alert(successMessage);

              if (this.props.onSubmit) this.props.onSubmit();
            })
            .catch((err) => {
              this.setState({ submitting: false });
              console.error(err);
            });
        } else {
          this.setState({
            step: this.state.step + 1
          }, () => console.info(this.state));
        }
      }
    }, 0);
  }

  onChange(obj) {
    const form = Object.assign({}, this.state.form, obj);
    this.setState({ form }, () => console.info(this.state.form));
  }

  onChangeDataset(dataset) {
    this.setState({ dataset });
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
            ref={(c) => { this.step = c; }}
            form={this.state.form}
            id={this.state.id}
            dataset={this.state.dataset}
            datasets={this.state.datasets}
            onChange={value => this.onChange(value)}
            onChangeDataset={value => this.onChangeDataset(value)}
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

LayersForm.propTypes = {
  id: React.PropTypes.string,
  dataset: React.PropTypes.string,
  authorization: React.PropTypes.string,
  application: React.PropTypes.array,
  onSubmit: React.PropTypes.func
};

export default LayersForm;
