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

// component
import DatasetSubscriptionsModal from './component';

class DatasetSubscriptionModalContainer extends Component {
  static propTypes = {
    userSelection: PropTypes.object.isRequired,
    areas: PropTypes.array.isRequired,
    userAreas: PropTypes.array.isRequired,
    areaFound: PropTypes.bool.isRequired,
    activeDataset: PropTypes.object.isRequired,
    subscriptions: PropTypes.array.isRequired,
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
      activeDataset,
      setUserSelection,
      getAreas,
      getUserAreas,
      getDatasets,
      getUserSubscriptions
    } = this.props;

    // fetchs areas to populate areas selector
    getAreas();
    // fetchs user areas to populate areas selector
    getUserAreas();
    // fetchs suscribable datasets to populate datasets selector
    getDatasets();
    // fetchs user subscriptions
    getUserSubscriptions();

    if (Object.keys(activeDataset).length) {
      setUserSelection({
        datasets: [activeDataset].map(dataset => ({
          id: dataset.id,
          label: dataset.name,
          value: dataset.name,
          subscriptions: sortBy(Object.keys(dataset.subscribable || dataset.attributes.subscribable)
            .map((val, index) => ({
              label: val,
              value: val,
              ...((dataset.subscribable || dataset.attributes.subscribable)[val] && { query: ((dataset.subscribable || dataset.attributes.subscribable)[val] || {}).dataQuery }),
              ...(index === 0 && { selected: true })
            })), 'label'),
          threshold: 1
        }))
      });
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { subscriptions, setUserSelection, activeArea } = this.props;
    const { subscriptions: nextSubscriptions, activeArea: nextActiveArea } = nextProps;
    const subscriptionsChanged = !isEqual(subscriptions, nextSubscriptions);

    if (nextSubscriptions.length && subscriptionsChanged) {
      if (nextActiveArea && nextActiveArea.subscription) {
        const currentSubscription = nextSubscriptions.find(_subscription =>
          _subscription.id === activeArea.subscription.id);
        const subscriptionTypes = currentSubscription.attributes.datasetsQuery
          .filter(_datasetQuery => _datasetQuery.type)
          .map(_datasetQuery => _datasetQuery.type);

        setUserSelection({
          datasets: activeArea.subscription.attributes.datasets.map((dataset, index) => ({
            id: dataset.id,
            label: dataset.name,
            value: dataset.name,
            subscriptions: sortBy(Object.keys(dataset.subscribable ||
              dataset.attributes.subscribable)
              .map(val => ({
                label: val,
                value: val,
                ...(subscriptionTypes.includes(val) && { selected: true })
              })), 'label'),
            threshold: activeArea.subscription.attributes.datasetsQuery[index].threshold
          }))
        });
      }
    }
  }

  componentWillUnmount() {
    const {
      clearSubscriptions,
      clearUserSelection,
      clearLocalSubscriptions,
      activeDataset,
      setUserSelection
    } = this.props;

    clearLocalSubscriptions();
    clearSubscriptions();
    clearUserSelection();

    if (Object.keys(activeDataset).length) {
      setUserSelection({
        datasets: [activeDataset].map(dataset => ({
          id: dataset.id,
          label: dataset.name,
          value: dataset.name,
          subscriptions: sortBy(Object.keys(dataset.subscribable || dataset.attributes.subscribable)
            .map((val, index) => ({
              label: val,
              value: val,
              ...((dataset.subscribable || dataset.attributes.subscribable)[val] && { query: ((dataset.subscribable || dataset.attributes.subscribable)[val] || {}).dataQuery }),
              ...(index === 0 && { selected: true })
            })), 'label'),
          threshold: 1
        }))
      });
    }
  }

  render() {
    return (<DatasetSubscriptionsModal {...this.props} />);
  }
}

export default connect(
  (state, props) => ({
    userSelection: state.subscriptions.userSelection,
    areas: getAvailableAreas(state),
    areaFound: isAreaFound(state),
    userAreas: state.user.areas.items,
    activeDataset: state.layerCardPulse.dataset || props.dataset,
    subscriptions: state.subscriptions.list,
    subscription: state.subscriptions.subscriptionCreation,
    preview: state.subscriptions.list.preview,
    loading: state.subscriptions.areas.loading ||
      state.subscriptions.userAreas.loading || state.subscriptions.datasets.loading
    // loading: state.subscriptions.loading || state.subscriptions.areas.loading ||
    //   state.subscriptions.userAreas.loading || state.subscriptions.datasets.loading
  }),
  {
    getUserAreas,
    ...actions
  }
)(DatasetSubscriptionModalContainer);
