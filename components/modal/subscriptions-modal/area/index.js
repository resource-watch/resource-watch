import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import sortBy from 'lodash/sortBy';
import isEqual from 'lodash/isEqual';

// actions
import { getUserAreas } from 'redactions/user';
import * as actions from '../actions';

// selectors
import {
  getAvailableAreas,
  isAreaFound
} from '../selectors';
import { getSubscriptionsByArea } from './selectors';

// component
import AreaSubscriptionsModal from './component';

class AreaSubscriptionsModalContainer extends Component {
  static propTypes = {
    userSelection: PropTypes.object.isRequired,
    areas: PropTypes.array.isRequired,
    userAreas: PropTypes.array.isRequired,
    areaFound: PropTypes.bool.isRequired,
    activeArea: PropTypes.object.isRequired,
    subscriptionsByArea: PropTypes.array.isRequired,
    subscription: PropTypes.object.isRequired,
    loading: PropTypes.bool.isRequired,
    setAreas: PropTypes.func.isRequired,
    getAreas: PropTypes.func.isRequired,
    getUserAreas: PropTypes.func.isRequired,
    getDatasets: PropTypes.func.isRequired,
    getUserSubscriptions: PropTypes.func.isRequired,
    setUserSelection: PropTypes.func.isRequired,
    clearUserSelection: PropTypes.func.isRequired,
    onRequestClose: PropTypes.func.isRequired,
    resetModal: PropTypes.func.isRequired,
    createSubscriptionToArea: PropTypes.func.isRequired,
    createSubscriptionOnNewArea: PropTypes.func.isRequired,
    updateSubscription: PropTypes.func.isRequired,
    clearSubscriptions: PropTypes.func.isRequired,
    clearLocalSubscriptions: PropTypes.func.isRequired
  }

  UNSAFE_componentWillMount() {
    const {
      activeArea,
      setUserSelection,
      getAreas,
      getDatasets,
      getUserSubscriptions
    } = this.props;

    // fetchs areas to populate areas selector
    getAreas();
    // fetchs user areas to populate areas selector
    this.props.getUserAreas();
    // fetchs suscribable datasets to populate datasets selector
    getDatasets();
    // fetchs user subscriptions
    getUserSubscriptions();

    setUserSelection({ area: activeArea });
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { subscriptionsByArea, setUserSelection } = this.props;
    const { subscriptionsByArea: nextSubscriptions, activeArea: nextActiveArea } = nextProps;
    const subscriptionsChanged = !isEqual(subscriptionsByArea, nextSubscriptions);

    if (nextSubscriptions.length && subscriptionsChanged) {
      if (nextActiveArea && nextActiveArea.subscriptions) {
        setUserSelection({
          datasets: nextActiveArea.subscriptions.map((subscription) => {
            const dataset = subscription.datasets[0];
            const datasetQuery = subscription.datasetsQuery[0];
            return {
              id: dataset.id,
              label: dataset.name,
              value: dataset.name,
              subscriptions: sortBy(Object.keys(dataset.subscribable)
                .map(val => ({
                  label: val,
                  value: val,
                  ...(datasetQuery.type.includes(val) && { selected: true })
                })), 'label'),
              threshold: datasetQuery.threshold
            };
          })
        });
      }
    }
  }

  componentWillUnmount() {
    const {
      clearSubscriptions,
      clearUserSelection,
      clearLocalSubscriptions
    } = this.props;

    clearLocalSubscriptions();
    clearSubscriptions();
    clearUserSelection();
  }

  render() {
    return (<AreaSubscriptionsModal {...this.props} />);
  }
}

export default connect(
  state => ({
    userSelection: state.subscriptions.userSelection,
    areas: getAvailableAreas(state),
    areaFound: isAreaFound(state),
    userAreas: state.subscriptions.userAreas.list,
    subscriptionsByArea: getSubscriptionsByArea(state),
    subscription: state.subscriptions.userSelection,
    subscriptionCreation: state.subscriptions.subscriptionCreation,
    preview: state.subscriptions.list.preview,
    loading: state.subscriptions.areas.loading ||
      state.subscriptions.userAreas.loading || state.subscriptions.datasets.loading
  }),
  {
    ...actions,
    getUserAreas
  }
)(AreaSubscriptionsModalContainer);
