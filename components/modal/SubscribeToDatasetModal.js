import React from 'react';
import PropTypes from 'prop-types';
import { Autobind } from 'es-decorators';

// Services
import AreasService from 'services/AreasService';

// components
import CustomSelect from 'components/ui/CustomSelect';
import Spinner from 'components/ui/Spinner';


class SubscribeToDatasetModal extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      areaOptions: [],
      loadingAreaOptions: false,
      selectedArea: null
    };

    this.areasService = new AreasService({ apiURL: process.env.API_URL });
  }

  componentDidMount() {
    this.setState({
      loadingAreaOptions: true
    });
    this.areasService.fetchCountries().then((response) => {
      this.setState({
        areaOptions: response.data,
        loadingAreaOptions: false
      });
    });
  }

  @Autobind
  onChangeSelectedArea(value) {
    this.setState({
      selectedArea: value
    });
  }

  @Autobind
  handleSubscribe() {
    const { selectedArea } = this.state;
    if (selectedArea) {

    }
  }

  render() {
    const { areaOptions, loadingAreaOptions, selectedArea } = this.state;
    const { dataset } = this.props;
    const headerText = `Subscribe to ${dataset.attributes.name}`;

    return (
      <div className="c-subscribe-to-dataset-modal">
        <div className="share-content">
          <h1 className="c-text -header-normal -thin title">{headerText}</h1>
          <p>Metadata lorem ipsum casius tesebe Integer posuere erat a ante venenatis
             dapibus posuere velit aliquet. Praesent commodo cursus magna,
             vel scelerisque nisl consectetur et. Donec sed odio dui.</p>
        </div>
        <div className="area-selector">
          <Spinner isLoading={loadingAreaOptions} className="-light -small" />
          <CustomSelect
            placeholder="Select area"
            options={areaOptions}
            onValueChange={this.onChangeSelectedArea}
            allowNonLeafSelection={false}
            value={selectedArea}
          />
        </div>
        <div className="buttons-div">
          <button className="c-btn -primary" onClick={this.handleSubscribe}>
            Subscribe
          </button>
          <button className="c-btn -secondary" onClick={() => this.props.toggleModal()}>
            Cancel
          </button>
        </div>
      </div>
    );
  }
}

SubscribeToDatasetModal.propTypes = {
  toggleModal: PropTypes.func.isRequired,
  dataset: PropTypes.object.isRequired
};


export default SubscribeToDatasetModal;
