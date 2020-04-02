import { connect } from 'react-redux';

// component
import DatasetLayersComponent from './component';

export default connect(
  state => ({ layerGroups: state.explore.map.layerGroups }),
  null
)(DatasetLayersComponent);
