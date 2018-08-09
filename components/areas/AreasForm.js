import React from 'react';
import PropTypes from 'prop-types';
import { Router } from 'routes';
import { toastr } from 'react-redux-toastr';

// Redux
import { connect } from 'react-redux';
import { toggleModal, setModalOptions } from 'redactions/modal';

// Components
import CustomSelect from 'components/ui/CustomSelect';
import Spinner from 'components/ui/Spinner';
import Map from 'components/ui/map/Map';
import Field from 'components/form/Field';
import Input from 'components/form/Input';
import UploadArea from 'components/areas/UploadArea';

// Services
import AreasService from 'services/AreasService';
import UserService from 'services/UserService';

// Utils
import { logEvent } from 'utils/analytics';
import LayerManager from 'utils/layers/LayerManager';

// Constants
const MAP_CONFIG = {
  zoom: 3,
  latLng: {
    lat: 0,
    lng: 0
  },
  zoomControl: true
};

const FORM_ELEMENTS = {
  elements: { },
  validate() {
    const { elements } = this;
    Object.keys(elements).forEach((k) => {
      elements[k].validate();
    });
  },
  isValid() {
    const { elements } = this;
    const valid = Object.keys(elements)
      .map(k => elements[k].isValid())
      .filter(v => v !== null)
      .every(element => element);

    return valid;
  }
};

class AreasForm extends React.Component {
  static propTypes = {
    mode: PropTypes.string.isRequired, // edit | new
    id: PropTypes.string, // area id for edit mode,
    // Store
    user: PropTypes.object.isRequired,
    toggleModal: PropTypes.func.isRequired,
    routes: PropTypes.object.isRequired
  };

  static defaultProps = {
    openUploadAreaModal: false
  };

  constructor(props) {
    super(props);

    const { query } = props.routes;
    const { openUploadAreaModal } = query || {};
    const { areas } = props.user;

    const area = areas.items.find(a => a.id === query.id);
    let { name, geostore } = area ? area.attributes : {};

    this.state = {
      areaOptions: [],
      loadingAreaOptions: false,
      loading: false,
      name: name || '',
      geostore: geostore || '',
      openUploadAreaModal,
      geojson: null
    };

    this.map = null;

    // Services
    this.areasService = new AreasService({ apiURL: process.env.WRI_API_URL });
    this.userService = new UserService({ apiURL: process.env.WRI_API_URL });

    // ---------------- Bindings --------------------
    this.onSubmit = this.onSubmit.bind(this);
    this.onChangeSelectedArea = this.onChangeSelectedArea.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
    //----------------------------------------------
  }

  componentDidMount() {
    const { openUploadAreaModal } = this.state;
    const { query } = this.props.routes;

    if (query.id && query.id === 'new') {
      this.loadAreas();
    }

    if (openUploadAreaModal) {
      this.openUploadAreaModal();
    }
  }

  async onSubmit(e) {
    e.preventDefault();
    const drawedGeoJson = this.state.geojson ? await this.areasService.createGeostore(this.state.geojson) : null;

    const { name, geostore } = this.state;
    const { user, mode, id, routes } = this.props;
    const { query } = routes;
    const { subscriptionDataset } = query || {};

    if (geostore || (drawedGeoJson && 'id' in drawedGeoJson)) {
      this.setState({ loading: true });

      if (mode === 'new') {
        this.userService.createNewArea(name, drawedGeoJson.id || geostore, user.token)
          .then((response) => {
            Router.pushRoute('myrw', {
              tab: 'areas',
              openModal: response.data.id && subscriptionDataset,
              subscriptionDataset
            });
            toastr.success('Success', 'Area successfully created!');
          })
          .catch(error => this.setState({ error, loading: false }));

        logEvent('My RW', 'Create area', name);
      } else if (mode === 'edit') {
        this.userService.updateArea(id, name, user.token,
          drawedGeoJson && drawedGeoJson.id ? drawedGeoJson.id : null)
          .then(() => {
            Router.pushRoute('myrw', { tab: 'areas' });
            toastr.success('Success', 'Area successfully updated!');
          })
          .catch(error => this.setState({ error, loading: false }));

        logEvent('My RW', 'Edit area', name);
      }
    } else {
      toastr.info('Data missing', 'Please select an area');
    }
  }

  async onChangeSelectedArea(value) {
    if (typeof value === 'undefined') {
      this.setState({ geostore: null });
      return null;
    }
    return new Promise((resolve) => {
      this.setState({ geostore: value.value });
      resolve(true);
    });
  }

  onMapDraw(layer) {
    this.setState({
      geojson: {
        geojson: {
          type: 'FeatureCollection',
          features: [layer.toGeoJSON()]
        }
      }
    });
  }

  handleNameChange(value) {
    this.setState({
      name: value
    });
  }

  loadAreas() {
    this.setState({ loadingAreaOptions: true });
    this.areasService.fetchCountries().then((response) => {
      this.setState({
        areaOptions: response.filter(elem => typeof elem.name !== 'undefined')
          .map(elem => ({ value: elem.geostoreId, label: elem.name })),
        loadingAreaOptions: false
      });
    });
  }

  render() {
    const {
      areaOptions,
      loadingAreaOptions,
      loading,
      geostore,
      name
    } = this.state;
    const { query } = this.props.routes;
    const { mode, user } = this.props;
    const { areas } = user;
    const area = areas.items.find(a => a.id === query.id);

    let layerGroups = [];

    if (area && area.id in user.areas.layerGroups) {
      layerGroups = user.areas.layerGroups[area.id];
    }

    return (
      <div className="c-areas-form">
        <Spinner loading={loading || loadingAreaOptions} className="-light" />
        <form className="c-form" onSubmit={this.onSubmit}>
          <fieldset className="c-field-container">
            <Field
              ref={(c) => { if (c) FORM_ELEMENTS.elements.name = c; }}
              onChange={this.handleNameChange}
              validations={['required']}
              properties={{
                name: 'name',
                label: 'Title',
                type: 'text',
                value: name,
                default: name,
                required: true
              }}
            >
              {Input}
            </Field>
          </fieldset>

          <div
            className="c-field selectors-container"
          >
            <Spinner isLoading={loadingAreaOptions || loading} className="-light -small" />
            <CustomSelect
              placeholder="Select area"
              options={areaOptions}
              onValueChange={this.onChangeSelectedArea}
              allowNonLeafSelection={false}
              value={geostore}
              waitForChangeConfirmation
              disabled={mode === 'edit'}
            />
          </div>

          {geostore && mode === 'new' && <span className="c-field__helpMessage">If you want to draw/upload a custom area, remove the selected area above.</span>}

          {!geostore && <div className="c-field c-field__map">
            <label>Draw Area</label>
            <div className="c-field__map--container">
              <Map
                LayerManager={LayerManager}
                mapConfig={{
                  ...MAP_CONFIG,
                  ...!!layerGroups.length && {
                    bbox: [
                      layerGroups[0].layers[0].layerConfig.bounds.coordinates[0][0][0],
                      layerGroups[0].layers[0].layerConfig.bounds.coordinates[0][0][1],
                      layerGroups[0].layers[0].layerConfig.bounds.coordinates[0][1][0],
                      layerGroups[0].layers[0].layerConfig.bounds.coordinates[0][1][1]
                    ]
                  }
                }}
                setMapInstance={(map) => { this.map = map; }}
                layerGroups={layerGroups}
                canDraw
                onMapDraw={layer => this.onMapDraw(layer)}
              />
            </div>
          </div>}

          {!geostore && <UploadArea />}

          <div className="buttons-div">
            <button type="button" onClick={() => Router.pushRoute('myrw', { tab: 'areas' })} className="c-btn -secondary">
              Cancel
            </button>
            <button type="submit" className="c-btn -primary">
              Submit
            </button>
          </div>
        </form>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user,
  routes: state.routes
});

const mapDispatchToProps = {
  toggleModal,
  setModalOptions
};

export default connect(mapStateToProps, mapDispatchToProps)(AreasForm);
