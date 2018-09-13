import { connect } from 'react-redux';

// actions
import { setUserSelection } from '../actions';

// selectors
import { getSuscribableDatasets } from './selectors';

// component
import DatasetManager from './component';

export default connect(
  state => ({
    datasets: getSuscribableDatasets(state),
    selectedDatasets: state.subscriptions.userSelection.datasets
  }),
  { setUserSelection }
)(DatasetManager);
