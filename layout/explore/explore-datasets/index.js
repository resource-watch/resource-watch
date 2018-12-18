import { connect } from 'react-redux';
import * as actions from 'layout/explore/explore-actions';

// selectors
import { getUpdatedDatasets } from './selectors';

// component
import ExploreDatasetsComponent from './explore-datasets-component';

export default connect(
  state => ({
    // Store
    ...state.explore.datasets,
    list: getUpdatedDatasets(state),
    ...state.explore.filters,
    responsive: state.responsive
  }),
  actions
)(ExploreDatasetsComponent);
