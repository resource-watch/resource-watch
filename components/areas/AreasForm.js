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
import UploadAreaIntersectionModal from 'components/modal/UploadAreaIntersectionModal';

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
  zoomControl: false
};

const mapStyles = {
  display: 'inline-block',
  height: '410px',
  position: 'relative',
  width: '100%'
};

const FORM_ELEMENTS = {
  elements: {
  },
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

const AREAS = [
  {
    label: 'Custom area',
    value: 'custom',
    items: [
      {
        label: 'Upload new area',
        value: 'upload',
        as: 'Custom area'
      }
    ]
  }
];

class AreasForm extends React.Component {
  static defaultProps = {
    openUploadAreaModal: false
  };

  static propTypes = {
    mode: PropTypes.string.isRequired, // edit | new
    id: PropTypes.string, // area id for edit mode,
    // Store
    user: PropTypes.object.isRequired,
    toggleModal: PropTypes.func.isRequired,
    routes: PropTypes.object.isRequired
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
      openUploadAreaModal
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

  onSubmit(e) {
    e.preventDefault();

    const { name, geostore } = this.state;
    const { user, mode, id, routes } = this.props;
    const { query } = routes;
    const { subscriptionDataset } = query || {};
    if (geostore) {
      this.setState({
        loading: true
      });

      if (mode === 'new') {
        this.userService.createNewArea(name, geostore, user.token)
          .then((response) => {
            Router.pushRoute('myrw', {
              tab: 'areas',
              openModal: response.data.id && subscriptionDataset,
              subscriptionDataset
            });
            toastr.success('Success', 'Area successfully created!');
          })
          .catch(err => this.setState({ error: err, loading: false }));

        logEvent('My RW', 'Create area', name);
      } else if (mode === 'edit') {
        this.userService.updateArea(id, name, user.token)
          .then(() => {
            Router.pushRoute('myrw', { tab: 'areas' });
            toastr.success('Success', 'Area successfully updated!');
          })
          .catch(err => this.setState({ error: err, loading: false }));

        logEvent('My RW', 'Edit area', name);
      }
    } else {
      toastr.info('Data missing', 'Please select an area');
    }
  }

  async onChangeSelectedArea(value) {
    return new Promise((resolve) => {
      if (value.value === 'upload') {
        this.props.toggleModal(true, {
          children: UploadAreaIntersectionModal,
          childrenProps: {
            onUploadArea: (id) => {
              this.setState({
                geostore: id
              });

              // We close the modal
              this.props.toggleModal(false, {});
              resolve(true);
            }
          },
          onCloseModal: () => resolve(false)
        });
      } else {
        this.setState({
          geostore: value.value
        });
        resolve(true);
      }
    });
  }

  openUploadAreaModal() {
    this.setState({
      geostore: 'custom'
    },
    () => this.onChangeSelectedArea({ value: 'upload' }));
  }

  handleNameChange(value) {
    this.setState({
      name: value
    });
  }

  loadAreas() {
    this.setState({
      loadingAreaOptions: true
    });
    this.areasService.fetchCountries().then((response) => {
      this.setState({
        areaOptions: [...AREAS,
          ...response.map(elem => ({ value: elem.geostoreId, label: elem.name || '' }))],
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
    const { mode } = this.props;

    console.log(this);

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
          {mode === 'new' &&
            <div
              className="selectors-container"
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
          }
          <div className="c-field">
            <label for="input-name" class="label">Draw Area</label>
            <div style={mapStyles}>
              <Map
                LayerManager={LayerManager}
                mapConfig={MAP_CONFIG}
                setMapInstance={(map) => { this.map = map; }}
                layerGroups={[]}
                canDraw
              />
            </div>
          </div>


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
