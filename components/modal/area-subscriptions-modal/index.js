import { connect } from 'react-redux';

// redux
import * as actions from './actions';
import * as reducers from './reducers';
import initialState from './initial-state';

// selectors
import {
  getAvailableAreas,
  isAreaFound
} from './selectors';

// component
import SubscriptionsModal from './component';

export { actions, reducers, initialState };

export default connect(
  state => ({
    userSelection: state.subscriptions.userSelection,
    areas: getAvailableAreas(state),
    areaFound: isAreaFound(state),
    userAreas: state.subscriptions.userAreas.list,
    activeDataset: state.layerCardPulse.dataset || state.exploreDetail.data,
    subscriptions: state.subscriptions.list,
    subscription: state.subscriptions.subscriptionCreation,
    preview: state.subscriptions.list.preview,
    loading: state.subscriptions.loading || state.subscriptions.areas.loading ||
      state.subscriptions.userAreas.loading || state.subscriptions.datasets.loading
  }),
  actions
)(SubscriptionsModal);
