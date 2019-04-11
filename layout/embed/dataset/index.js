import { connect } from 'react-redux';

// component
import LayoutEmbedDataset from './component';

export default connect(
  state => ({
    locale: state.common.locale,
    routes: state.routes
  }),
  null
)(LayoutEmbedDataset);
