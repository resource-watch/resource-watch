import React from 'react';
import PropTypes from 'prop-types';

// Redux
import { connect } from 'react-redux';

// Services
import DatasetsService from 'services/DatasetsService';
import { fetchLayer } from 'services/LayersService';
import { toastr } from 'react-redux-toastr';


import { setLayerInteractionError } from 'components/admin/data/layers/form/layer-preview/layer-preview-actions';

// Components
import Step1 from 'components/admin/data/layers/form/steps/Step1';
import Navigation from 'components/form/Navigation';
import Spinner from 'components/ui/Spinner';

import LayerManager from 'utils/layers/LayerManager';

// constants
import { STATE_DEFAULT, FORM_ELEMENTS } from './constants';

class LayersForm extends React.Component {
  constructor(props) {
    super(props);

    const formObj = props.dataset ?
      Object.assign({}, STATE_DEFAULT.form,
        { dataset: props.dataset, application: props.application }) :
      Object.assign({}, STATE_DEFAULT.form, { application: props.application });

    this.state = Object.assign({}, STATE_DEFAULT, {
      id: props.id,
      dataset: props.dataset,
      datasets: [],
      form: formObj,
      loading: !!props.id
    });

    // Service
    this.datasetsService = new DatasetsService({
      authorization: props.authorization,
      language: props.locale
    });

    this.layerManager = new LayerManager(null, {
      layersUpdated: (valid, err) => {
        this.props.dispatch(setLayerInteractionError(valid ? false : err));
      }
    });

    // BINDINGS
    this.onSubmit = this.onSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onChangeDataset = this.onChangeDataset.bind(this);
    this.onStepChange = this.onStepChange.bind(this);
  }

  componentDidMount() {
    const { id } = this.state;

    const promises = [
      this.datasetsService.fetchAllData({})
    ];

    // Add the dashboard promise if the id exists
    if (id) {
      promises.push(fetchLayer(id));
    }

    Promise.all(promises)
      .then((response) => {
        const datasets = response[0];
        const current = response[1];

        const formState = (id) ? this.setFormFromParams(current) : this.state.form;

        this.setState({
          // CURRENT LAYER
          form: formState,
          loading: false,
          // CURRENT DATASET
          dataset: formState.dataset,
          // OPTIONS
          datasets: datasets.map(d => ({ label: d.name, value: d.id }))
        });
      })
      .catch((err) => {
        toastr.error('Error', err);
      });
  }

  /**
   * UI EVENTS
   * - onSubmit
   * - onChange
   * - onChangeDataset
  */
  onSubmit(event) {
    if (event) event.preventDefault();

    // Validate the form
    FORM_ELEMENTS.validate(this.state.step);

    // Set a timeout due to the setState function of react
    setTimeout(() => {
      // Validate all the inputs on the current step
      const valid = FORM_ELEMENTS.isValid(this.state.step);
      const { interactions } = this.props;

      let interactionConfig = this.state.form.interactionConfig;
      // Grab all the interactions from the redux store
      if (this.state.form.provider === 'cartodb') {
        interactionConfig = Object.assign(
          {},
          this.state.form.interactionConfig,
          { output: interactions.added }
        );
      }

      const form = Object.assign({}, this.state.form, { interactionConfig });

      // Verify that layers are valid, otherwise render error
      const { adminLayerPreview } = this.props;
      const { layerGroups } = adminLayerPreview;
      const cartoLayer = layerGroups.length && 'layers' in layerGroups[0] ?
        layerGroups[0].layers.filter(layer => layer.provider === 'cartodb') : [];

      if (valid) {
        // Start the submitting
        this.setState({ submitting: true });
        this.props.dispatch(setLayerInteractionError(false));

        if (cartoLayer.length) {
          // If we have carto layers, make sure they work
          this.layerManager.verifyCartoLayer(Object.assign(
            {},
            cartoLayer[0],
            { layerConfig: form.layerConfig }
          ), (cartoLayerValid) => {
            if (cartoLayerValid) {
              this.saveLayer(form);
            } else {
              toastr.error('Error', 'Layer config contains errors');
              this.setState({ submitting: false });
            }
          });
          return;
        }

        this.saveLayer(form);
      } else {
        toastr.error('Error', 'Fill all the required fields or correct the invalid values');
      }
    }, 0);
  }

  onChange(obj) {
    const form = Object.assign({}, this.state.form, obj);
    this.setState({ form });
  }

  onChangeDataset(dataset) {
    this.setState({ dataset });
  }

  onStepChange(step) {
    this.setState({ step });
  }

  // HELPERS
  setFormFromParams(params) {
    const newForm = {};

    Object.keys(params).forEach((f) => {
      switch (f) {
        default: {
          if ((typeof params[f] !== 'undefined' || params[f] !== null) ||
              (typeof this.state.form[f] !== 'undefined' || this.state.form[f] !== null)) {
            newForm[f] = params[f] || this.state.form[f];
          }
        }
      }
    });

    return newForm;
  }

  /**
   * Set the layer interaction of the store
   * @export
   * @param {Layer{}} layer
   */
  setLayerInteraction(layer) {
    return (dispatch) => {
      dispatch({
        type: SET_LAYERS_INTERACTION,
        payload: layer
      });
    };
  }

  setLayerInteractionSelected(id) {
    return (dispatch) => {
      dispatch({
        type: SET_LAYER_INTERACTION_SELECTED,
        payload: id
      });
    };
  }


  setLayerInteractionLatLng(latlng) {
    return (dispatch) => {
      dispatch({
        type: SET_LAYER_INTERACTION_LATLNG,
        payload: latlng
      });
    };
  }

  verifyLayerConfig() {
    const { adminLayerPreview } = this.props;
    const { layerGroups } = adminLayerPreview;

    const { form } = this.state;

    const cartoLayer = layerGroups.length && 'layers' in layerGroups[0] ?
      layerGroups[0].layers.filter(layer => layer.provider === 'cartodb') : [];

    if (cartoLayer.length) {
      // If we have carto layers, make sure they work
      this.layerManager.verifyCartoLayer(Object.assign(
        {},
        cartoLayer[0],
        { layerConfig: form.layerConfig }
      ));
    }
  }

  saveLayer(form) {
    const { id, dataset } = this.state;
    this.service.saveData({
      dataset,
      id: id || '',
      type: (id) ? 'PATCH' : 'POST',
      body: form
    }).then((data) => {
      toastr.success('Success', `The layer "${data.id}" - "${data.name}" has been uploaded correctly`);
      if (this.props.onSubmit) this.props.onSubmit();
      this.setState({ submitting: false, form: data });
    }).catch((errors) => {
      this.setState({ submitting: false });
      try {
        errors.forEach(er => toastr.error('Error', er.detail));
      } catch (e) {
        toastr.error('Error', 'Oops! There was an error, try again.');
      }
    });
  }

  render() {
    return (
      <form className="c-form c-layers-form" onSubmit={this.onSubmit} noValidate>
        <Spinner isLoading={this.state.loading} className="-light" />

        {(this.state.step === 1 && !this.state.loading) &&
          <Step1
            ref={(c) => { this.step = c; }}
            form={this.state.form}
            id={this.state.id}
            layerPreview={this.props.adminLayerPreview}
            dataset={this.state.dataset}
            datasets={this.state.datasets}
            onChange={value => this.onChange(value)}
            onChangeDataset={value => this.onChangeDataset(value)}
            setLayerInteraction={this.setLayerInteraction}
            setLayerInteractionSelected={this.setLayerInteractionSelected}
            setLayerInteractionLatLng={this.setLayerInteractionLatLng}
            verifyLayerConfig={() => this.verifyLayerConfig()}
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
  id: PropTypes.string,
  dataset: PropTypes.string,
  authorization: PropTypes.string,
  application: PropTypes.array,
  onSubmit: PropTypes.func,
  locale: PropTypes.string.isRequired,
  interactions: PropTypes.object.isRequired,
  adminLayerPreview: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  locale: state.common.locale,
  interactions: state.interactions,
  adminLayerPreview: state.adminLayerPreview
});

export default connect(mapStateToProps, null)(LayersForm);
