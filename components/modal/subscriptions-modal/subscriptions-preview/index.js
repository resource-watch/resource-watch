import { connect } from 'react-redux';

// redux
import { getUserSubscriptionsPreview } from '../actions';
import * as reducers from '../reducers';
import initialState from '../initial-state';


// component
import SubscribePreview from './component';

export { actions, reducers, initialState };

export default connect(
  state => ({
    loading: state.subscriptions.preview.loading,
    activeDataset: state.layerCardPulse.dataset || state.exploreDetail.data,
    preview: state.subscriptions.preview,
    datasetTitle: state.subscriptions.userSelection.datasets,
    activeDataset: state.layerCardPulse.dataset || state.exploreDetail.data,

  }),
  { getUserSubscriptionsPreview }
)(SubscribePreview);

