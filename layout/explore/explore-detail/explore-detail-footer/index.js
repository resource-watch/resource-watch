import { connect } from 'react-redux';
import * as actions from 'layout/explore/actions';

// component
import ExploreDetailFooterComponent from './component';

export default connect(null,
  actions)(ExploreDetailFooterComponent);
