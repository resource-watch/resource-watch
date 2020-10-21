import { connect } from 'react-redux';

// constants
import { getRWAdapter } from 'constants/widget-editor';

// component
import LayoutEmbedDataset from './component';

export default connect(
  (state) => ({
    locale: state.common.locale,
    routes: state.routes,
    RWAdapter: getRWAdapter({ locale: state.common.locale }),
  }),
  null,
)(LayoutEmbedDataset);
