import React from 'react';
import PropTypes from 'prop-types';
import { toastr } from 'react-redux-toastr';
import isEqual from 'lodash/isEqual';

// Redux
import { connect } from 'react-redux';

import { getUserAreas } from 'redactions/user';

// Selectors
import areaAlerts from 'selectors/user/areaAlerts';

// Services
import AreasService from 'services/AreasService';
import UserService from 'services/UserService';
import DatasetService from 'services/DatasetService';

// Components
import Spinner from 'components/ui/Spinner';
import SubscriptionSelector from 'components/subscriptions/SubscriptionSelector';

// Utils
import { getLabel } from 'utils/datasets/dataset-helpers';
import { logEvent } from 'utils/analytics';

class AreaSubscriptionModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loadingDatasets: true,
      loading: false,
      datasets: [],
      alerts: props.alerts[props.area.id],
      sortedDatasets: []
    };

    // Services
    this.datasetService = new DatasetService(null, {
      apiURL: process.env.WRI_API_URL,
      language: props.locale
    });
    this.areasService = new AreasService({ apiURL: process.env.WRI_API_URL });
    this.userService = new UserService({ apiURL: process.env.WRI_API_URL });

    // ------------------- Bindings -----------------------
    this.handleCancel = this.handleCancel.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    // ----------------------------------------------------
  }

  componentDidMount() {
    this.loadDatasets();
  }

  onChangeSubscription(value, type, key) {
    let modified = false;
    const { alerts, datasets } = this.state;
    alerts.map((a, k) => {
      if (k === key) {
        if (type === 'dataset') {
          let dataset = datasets.find(d => d.id === value);
          modified = dataset.id !== a.dataset;
          const label = getLabel(dataset);
          dataset = { ...dataset.attributes };
          dataset.label = label;
          a.dataset = dataset;
        } else {
          modified = a[type] !== value;
          a[type] = value;
        }
      }
      return a;
    });

    if (modified) {
      this.setState({ alerts });
    }
  }

  onRemoveDataset(key) {
    let { alerts } = this.state;
    alerts = alerts.filter((a, k) => k !== key);
    this.setState({ alerts });
  }

  onAddAlert() {
    const { alerts } = this.state;
    const newAlert = {
      dataset: {
        subscribable: {}
      },
      id: null,
      lastSeenDate: null,
      threshold: 1,
      type: null
    };
    alerts.push(newAlert);
    this.setState({ alerts });
  }

  loadDatasets() {
    this.datasetService.getSubscribableDatasets('metadata').then((response) => {
      this.setState({
        loadingDatasets: false,
        datasets: response,
        sortedDatasets: response.map((dataset) => {
          const label = getLabel(dataset);
          return { value: dataset.id, label };
        })
      });
    }).catch(err => toastr.error('Error', err)); // TODO: update the UI
  }

  handleSubmit() {
    const { area, user, locale } = this.props;
    const { alerts } = this.state;
    const { userService } = this;

    let missingValues = false;

    const datasets = alerts.map(a => a.dataset.id);
    const datasetsQuery = alerts.map((a) => {
      missingValues = missingValues || (!a.dataset.id || !a.type || !a.threshold);
      return {
        id: a.dataset.id,
        type: a.type,
        threshold: a.threshold
      };
    });

    if (missingValues) {
      toastr.error('Data missing', 'Please select a dataset, subscription type and threshold for all items');
      return;
    }

    logEvent('My RW', 'Edit subscription', area.attributes.name);

    if (!area.subscription.id) {

      if (!datasets.length) {
        toastr.error('Error', 'Please select at least one dataset');
        return;
      }

      userService.createSubscriptionToArea(
        area.id,
        datasets,
        datasetsQuery,
        user,
        locale
      ).then(() => {
        toastr.success('Success!', 'Subscription created successfully');
        this.props.toggleModal(false);
        this.props.dispatch(getUserAreas());
      }).catch(err => toastr.error('Error creating the subscription', err));
    } else {
      if (!datasets.length) {
        userService.deleteSubscription(area.subscription.id, user.token)
          .then(() => {
            toastr.success('Success!', 'Subscription updated successfully');
            this.props.toggleModal(false);
            this.props.dispatch(getUserAreas());
          }).catch(err => toastr.error('Error updating the subscription', err));
        return;
      }

      userService.updateSubscriptionToArea(
        area.subscription.id,
        datasets,
        datasetsQuery,
        user,
        locale
      ).then(() => {
        toastr.success('Success!', 'Subscription updated successfully');
        this.props.toggleModal(false);
        this.props.dispatch(getUserAreas());
      }).catch(err => toastr.error('Error updating the subscription', err));
    }
  }

  handleCancel() {
    this.props.toggleModal(false);
  }

  render() {
    const {
      loading,
      loadingDatasets,
      sortedDatasets,
      alerts
    } = this.state;

    const { area } = this.props;

    return (
      <div className="c-area-subscription-modal" ref={(node) => { this.el = node; }}>
        <div className="header-div">
          <h2>{`${area.attributes.name} subscriptions`}</h2>
        </div>
        <div className="header-text">
          Select the datasets that you want to subscribe to.
        </div>

        <Spinner isLoading={loading || loadingDatasets} className="-light" />

        <div className="datasets-container">
          {!loadingDatasets && sortedDatasets && alerts.map((alert, key) => (alert &&
            <SubscriptionSelector
              onChangeSubscription={(value, type, k) => this.onChangeSubscription(value, type, k)}
              onRemoveDataset={k => this.onRemoveDataset(k)}
              index={key}
              key={key}
              datasets={sortedDatasets}
              alert={alert}
            />
            ))}
        </div>

        <div className="new-container">
          <button
            className="c-btn -b -fullwidth"
            onClick={() => this.onAddAlert()}
          >Add dataset
          </button>
        </div>
        <div className="buttons">
          <button className="c-btn -primary" onClick={() => this.handleSubmit()}>
            Done
          </button>
          <button className="c-btn -secondary" onClick={() => this.handleCancel()}>
            Cancel
          </button>
        </div>
      </div>
    );
  }
}

AreaSubscriptionModal.propTypes = {
  alerts: PropTypes.object.isRequired,
  area: PropTypes.object.isRequired,
  toggleModal: PropTypes.func.isRequired,
  dispatch: PropTypes.func.isRequired,
  locale: PropTypes.string.isRequired,
  // Store
  user: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  user: state.user,
  locale: state.common.locale,
  alerts: areaAlerts(state)
});

export default connect(mapStateToProps, null)(AreaSubscriptionModal);
