import { connect } from 'react-redux';
import * as actions from 'layout/explore/actions';

// component
import DatasetLayerCardComponent from './component';

export default connect(
  state => ({ layerGroups: state.explore.map.layerGroups }),
  actions
)(DatasetLayerCardComponent);
