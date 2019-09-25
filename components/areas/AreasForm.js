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
import { createGeostore, fetchCountries } from 'services/geostore';
import { createArea, updateArea } from 'services/areas';

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
  elements: {},
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
    routes: PropTypes.object.isRequired
  };

  static defaultProps = { id: null };

  constructor(props) {
    super(props);

    const { query } = props.routes;
    const { areas } = props.user;

    const area = areas.items.find(a => a.id === query.id);
    const { name, geostore } = area || {};

    this.state = {
      areaOptions: [],
      loadingAreaOptions: false,
      loading: false,
      name: name || '',
      geostore: geostore || '',
      geojson: null,
      geoCountrySelected: false
    };

    this.map = null;
  }

  componentDidMount() {
    const { query } = this.props.routes;

    if (query.id) {
      this.loadAreaOptions();
    }
  }

  onSubmit = (e) => {
    e.preventDefault();

    const { geojson, name, geostore } = this.state;
    const { id, user, routes } = this.props;
    const { token } = user;
    const { query } = routes;
    const { subscriptionDataset } = query || {};

    if (!id) {
      // custom area flow
      if (geojson) {
        createGeostore(geojson).then((_geostore) => {
          const { id: geostoreId } = _geostore;

          this.setState({
            geostore: geostoreId,
            loading: true
          }, () => {
            createArea(name, geostoreId, token)
              .then(() => {
                this.setState({ loading: false }, () => {
                  toastr.success('Success', 'Area successfully created!');
                  logEvent('My RW', 'Create area', name);
                  Router.pushRoute('myrw', {
                    tab: 'areas',
                    subscriptionDataset
                  });
                });
              })
              .catch(() => {
                this.setState({ loading: false });
                toastr.error('');
              });
          });
        });
      // country flow
      } else if (geostore) {
        this.setState({ loading: true }, () => {
          createArea(name, geostore, token)
            .then(() => {
              this.setState({ loading: false }, () => {
                toastr.success('Success', 'Area successfully created!');
                logEvent('My RW', 'Create area', name);
                Router.pushRoute('myrw', {
                  tab: 'areas',
                  subscriptionDataset
                });
              });
            })
            .catch((error) => {
              this.setState({ loading: false });
              toastr.error(error);
            });
        });
      }
    } else {
      // UPDATE AREA
      updateArea(id, name, token, geostore)
        .then(() => {
          Router.pushRoute('myrw', { tab: 'areas' });
          toastr.success('Success', 'Area successfully updated!');
        })
        .catch((error) => {
          this.setState({ loading: false });
          toastr.error(error);
        });
    }
  }

  onChangeSelectedArea = (value) => {
    if (typeof value === 'undefined') {
      this.setState({ geostore: null, geoCountrySelected: false });
      return null;
    }
    return new Promise((resolve) => {
      this.setState({ geostore: value.value, geoCountrySelected: true });
      resolve(true);
    });
  }

  onMapDraw(layerGroup) {
    const geoJsonStructure = {
      type: 'FeatureCollection',
      features: []
    };

    layerGroup.eachLayer((l) => {
      geoJsonStructure.features.push(l.toGeoJSON());
    });

    this.setState({ geojson: { geojson: geoJsonStructure } });
  }

  onUploadArea(id) {
    this.setState({ geostore: id });
  }

  handleNameChange = (value) => {
    this.setState({ name: value });
  }

  loadAreaOptions() {
    this.setState({ loadingAreaOptions: true });
    fetchCountries().then((response) => {
      let geoCountrySelected = false;
      this.setState({
        areaOptions: response
          .filter(elem => typeof elem.name !== 'undefined')
          .map((elem) => {
            geoCountrySelected = elem.geostoreId === this.state.geostore;
            return { value: elem.geostoreId, label: elem.name };
          }),
        geoCountrySelected,
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
      name,
      geoCountrySelected
    } = this.state;
    const { query } = this.props.routes;
    const { mode, user, id } = this.props;
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
              ref={(c) => {
                if (c) FORM_ELEMENTS.elements.name = c;
              }}
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

          {!id &&
            <div className="c-field selectors-container">
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
          }

          {geostore && geoCountrySelected && (
            <span className="c-field__helpMessage">
              If you want to draw/upload a custom area, remove the selected area above.
            </span>
          )}

          {(!geostore || !geoCountrySelected) && (!id) && (
            <div className="c-field c-field__map">
              <p>Draw Area</p>
              <div className="c-field__map--container">
                <Map
                  LayerManager={LayerManager}
                  mapConfig={{
                    ...MAP_CONFIG,
                    ...(!!layerGroups.length && {
                      bbox: [
                        layerGroups[0].layers[0].layerConfig.bounds.coordinates[0][0][0],
                        layerGroups[0].layers[0].layerConfig.bounds.coordinates[0][0][1],
                        layerGroups[0].layers[0].layerConfig.bounds.coordinates[0][1][0],
                        layerGroups[0].layers[0].layerConfig.bounds.coordinates[0][1][1]
                      ]
                    })
                  }}
                  setMapInstance={(map) => {
                    this.map = map;
                  }}
                  layerGroups={layerGroups}
                  canDraw
                  onMapDraw={layer => this.onMapDraw(layer)}
                />
              </div>
            </div>
          )}

          {(!geostore || !geoCountrySelected) && (!id) && (
            <UploadArea onUploadArea={idValue => this.onUploadArea(idValue)} />
          )}

          <div className="buttons-div">
            <button
              type="button"
              onClick={() => Router.pushRoute('myrw', { tab: 'areas' })}
              className="c-btn -secondary"
            >
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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AreasForm);
