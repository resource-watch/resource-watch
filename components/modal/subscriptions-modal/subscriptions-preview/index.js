import { connect } from 'react-redux';

// actions
import { getUserSubscriptionsPreview } from '../actions';

// selectors
import { parseTableData } from './selectors';

// component
import SubscribePreview from './component';

export default connect(
  state => ({
    data: parseTableData(state),
    loading: state.subscriptions.preview.loading,
    activeDataset: state.layerCardPulse.dataset,
    preview: state.subscriptions.preview,
    datasetTitle: state.subscriptions.userSelection.datasets
  }),
  { getUserSubscriptionsPreview }
)(SubscribePreview);

