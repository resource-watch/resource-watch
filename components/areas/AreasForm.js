import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Router, Link } from 'routes';
import { toastr } from 'react-redux-toastr';
import { connect } from 'react-redux';
import { toggleModal, setModalOptions } from 'redactions/modal';
import debounce from 'lodash/debounce';

// components
import Map from 'components/map';
import Drawer from 'components/map/plugins/drawer';
import MapControls from 'components/map/controls';
import ZoomControls from 'components/map/controls/zoom';
import DrawPolygonControls from 'components/map/controls/draw-polygon';
import CustomSelect from 'components/ui/CustomSelect';
import Spinner from 'components/ui/Spinner';
import Field from 'components/form/Field';
import Input from 'components/form/Input';
import UploadArea from 'components/areas/UploadArea';

// Services
import { createGeostore, fetchCountries } from 'services/geostore';
import { createArea, updateArea } from 'services/areas';

// Utils
import { logEvent } from 'utils/analytics';

// constants
import { DEFAULT_VIEWPORT, MAPSTYLES } from 'components/map/constants';

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
      viewport: DEFAULT_VIEWPORT,
      isDrawing: false,
      areaOptions: [],
      loadingAreaOptions: true,
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
    const handleRedirect = () => {
      Router.pushRoute('myrw', {
        tab: 'areas',
        subscriptionDataset
      });
    };

    if (!id) {
      // custom area flow
      if (geojson) {
        createGeostore(geojson)
          .then((_geostore) => {
            const { id: geostoreId } = _geostore;

            this.setState({
              geostore: geostoreId,
              loading: true
            }, () => {
              createArea(name, geostoreId, token)
                .then(() => {
                  this.setState({ loading: false }, () => {
                    logEvent('My RW', 'Create area', name);
                    toastr.success('Area created successfully', 'You will be redirected to your areas.', {
                      timeOut: 2000,
                      onHideComplete: handleRedirect
                    });
                  });
                })
                .catch(() => {
                  this.setState({ loading: false });
                  toastr.error('There was an error creating the area.');
                });
            });
          })
          .catch(() => {
            toastr.error('There was an error creating the area.');
          });
      // country flow
      } else if (geostore) {
        this.setState({ loading: true }, () => {
          createArea(name, geostore, token)
            .then(() => {
              this.setState({ loading: false }, () => {
                logEvent('My RW', 'Create area', name);
                toastr.success('Area created successfully', 'You will be redirected to your areas.', {
                  timeOut: 2000,
                  onHideComplete: handleRedirect
                });
              });
            })
            .catch(() => {
              this.setState({ loading: false });
              toastr.error('There was an error creating the area.');
            });
        });
      }
    } else {
      // UPDATE AREA
      updateArea(id, name, token, geostore)
        .then(() => {
          logEvent('My RW', 'Update area', name);
          Router.pushRoute('myrw', { tab: 'areas' });
          toastr.success('Success', 'Area successfully updated!');
        })
        .catch(() => {
          this.setState({ loading: false });
          toastr.error('There was an error updating the area.');
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

  onUploadArea(id) {
    this.setState({ geostore: id });
  }

  _drawer = null;

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

  handleViewport = debounce((viewport) => {
    this.setState({ viewport });
  }, 250)

  handleZoom = (zoom) => {
    const { viewport: currentViewport } = this.state;

    this.setState({
      viewport: {
        ...currentViewport,
        zoom,
        // transitionDuration is always set to avoid mixing
        // durations of other actions (like flying)
        transitionDuration: 250
      }
    });
  }

  handleMapCursor = ({ isHovering, isDragging }) => {
    const { isDrawing } = this.state;

    if (isDrawing && isDragging) return 'grabbing';
    if (isDrawing) return 'crosshair';
    if (isHovering) return 'pointer';

    return 'grab';
  }

  handleDrawPolygon = () => {
    const { isDrawing } = this.state;
    this.setState({ isDrawing: !isDrawing });
  }

  handleRemovePolygon = () => {
    if (!this._drawer) return null;

    this._drawer.deleteAll();
    this._drawer.changeMode('draw_polygon');

    return this._drawer;
  }

  handleDrawComplete = (geojson) => {
    this.setState({ geojson });
  }

  render() {
    const {
      viewport,
      isDrawing,
      areaOptions,
      loadingAreaOptions,
      loading,
      geostore,
      name,
      geoCountrySelected
    } = this.state;
    const { id, mode } = this.props;
    const mapClass = classnames({ 'no-pointer-events': isDrawing });

    return (
      <div className="c-areas-form">
        <form
          className="c-form"
          onSubmit={this.onSubmit}
        >
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

          <div className="c-field selectors-container">
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

          {(geostore && geoCountrySelected) && (
            <span className="c-field__helpMessage">
              If you want to draw/upload a custom area, remove the selected area above.
            </span>)}

          {(!geostore || !geoCountrySelected) && (!id) && (
            <div className="c-field">
              <p>Draw Area</p>
              <div className="c-field__map--container">
                <Spinner
                  isLoading={loading || loadingAreaOptions}
                  className="-light"
                />
                <Map
                  mapboxApiAccessToken={process.env.RW_MAPBOX_API_TOKEN}
                  mapStyle={MAPSTYLES}
                  viewport={viewport}
                  basemap="dark"
                  onViewportChange={this.handleViewport}
                  getCursor={this.handleMapCursor}
                  className={mapClass}
                >
                  {_map => (
                    <Drawer
                      map={_map}
                      drawing={isDrawing}
                      onEscapeKey={() => { this.setState({ isDrawing: false }); }}
                      onReady={(_drawer) => { this._drawer = _drawer; }}
                      onDrawComplete={this.handleDrawComplete}
                    />
                  )}
                </Map>
                <MapControls>
                  <ZoomControls
                    viewport={viewport}
                    onClick={this.handleZoom}
                  />
                  <DrawPolygonControls
                    drawing={isDrawing}
                    onDrawPolygon={this.handleDrawPolygon}
                    onRemovePolygon={this.handleRemovePolygon}
                    showRemovePolygonButton={isDrawing}
                  />
                </MapControls>
              </div>
            </div>
        )}

          {(!geostore || !geoCountrySelected) && (!id) && (
            <UploadArea onUploadArea={idValue => this.onUploadArea(idValue)} />
          )}

          <div className="c-button-container -full-width -j-end">
            <ul>
              <li>
                <Link
                  route="myrw"
                  params={{ tab: 'areas' }}
                >
                  <a className="c-btn -secondary">Cancel</a>
                </Link>
              </li>
              <li>
                <button
                  type="submit"
                  className="c-btn -primary"
                >
                  Submit
                </button>
              </li>
            </ul>
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
