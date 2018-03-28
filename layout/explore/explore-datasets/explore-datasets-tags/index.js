// Redux
import { connect } from 'react-redux';
import * as actions from 'layout/explore/explore-actions';

import ExploreDatasetsTagsComponent from './explore-datasets-actions-component';

export default connect(
  null,
  actions
)(ExploreDatasetsTagsComponent);
