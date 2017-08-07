import React from 'react';
import PropTypes from 'prop-types';
import { Router } from 'routes';
import { Autobind } from 'es-decorators';

// Redux
import withRedux from 'next-redux-wrapper';
import { initStore } from 'store';

// Services
import AreasService from 'services/AreasService';
import UserService from 'services/UserService';

// components
import CustomSelect from 'components/ui/CustomSelect';
import Spinner from 'components/ui/Spinner';


class SubscribeToDatasetModal extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      areaOptions: [],
      loadingAreaOptions: false,
      selectedArea: null,
      loading: false,
      saved: false
    };

    this.areasService = new AreasService({ apiURL: process.env.WRI_API_URL });
    this.userService = new UserService({ apiURL: process.env.WRI_API_URL });
  }

  componentDidMount() {
    this.loadAreas();
  }

  @Autobind
  onChangeSelectedArea(value) {
    this.setState({
      selectedArea: value
    });
  }

  loadAreas() {
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
  handleSubscribe() {
    const { selectedArea } = this.state;
    const { dataset, user } = this.props;

    if (selectedArea) {
      this.setState({
        loading: true
      });
      this.userService.createSubscriptionToDataset(dataset.id, selectedArea.value, user)
        .then(() => {
          this.setState({
            loading: false,
            saved: true
          });
        })
        .catch(err => this.setState({ error: err, loading: false }));
    }
  }

  @Autobind
  handleGoToMySubscriptions() {
    this.props.toggleModal(false);
    Router.pushRoute('myrw', { tab: 'subscriptions' });
  }

  render() {
    const { areaOptions, loadingAreaOptions, selectedArea, loading, saved } = this.state;
    const { dataset } = this.props;
    const headerText = saved ? 'Subscription saved!' : `Subscribe to ${dataset.attributes.name}`;
    const paragraphText = saved ?
      'Your subscription was successfully created. Please check your email address to confirm it' :
      'Metadata lorem ipsum casius tesebe Integer posuere erat a ante venenatis dapibus posuere velit aliquet. Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Donec sed odio dui.';
    const cancelButtonText = saved ? 'Ok' : 'Cancel';

    return (
      <div className="c-subscribe-to-dataset-modal">
        <div className="header-div">
          <h1 className="c-text -header-normal -thin title">{headerText}</h1>
          <p>{paragraphText}</p>
        </div>
        {!saved &&
          <div className="area-selector">
            <Spinner isLoading={loadingAreaOptions || loading} className="-light -small" />
            <CustomSelect
              placeholder="Select area"
              options={areaOptions}
              onValueChange={this.onChangeSelectedArea}
              allowNonLeafSelection={false}
              value={selectedArea && selectedArea.value}
            />
          </div>
        }

        {saved &&
          <div className="icon-container">
            <img alt="" src="/static/images/components/modal/widget-saved.svg" />
          </div>
        }

        {!saved &&
          <div className="buttons-div">
            <button className="c-btn -primary" onClick={this.handleSubscribe}>
              Subscribe
            </button>
            <button className="c-btn -secondary" onClick={() => this.props.toggleModal()}>
              Cancel
            </button>
          </div>
        }

        {saved &&
          <div className="buttons-div">
            <button className="c-btn -secondary" onClick={() => this.props.toggleModal()}>
              Ok
            </button>
            <button className="c-btn -primary" onClick={this.handleGoToMySubscriptions}>
              Check my subscriptions
            </button>
          </div>
        }
      </div>
    );
  }
}

SubscribeToDatasetModal.propTypes = {
  toggleModal: PropTypes.func.isRequired,
  dataset: PropTypes.object.isRequired,
  // Store
  user: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  user: state.user
});

export default withRedux(initStore, mapStateToProps, null)(SubscribeToDatasetModal);
