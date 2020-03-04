import { connect } from 'react-redux';
import * as actions from 'layout/explore/actions';

// component
import ExploreDetailTagsComponent from './component';

export default connect(null, actions)(ExploreDetailTagsComponent);
