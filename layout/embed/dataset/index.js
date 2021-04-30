import { connect } from 'react-redux';

// constants
import {
  getRWAdapter,
} from 'utils/widget-editor';

// component
import LayoutEmbedDataset from './component';

export default connect(
  (state) => ({
    locale: state.common.locale,
    RWAdapter: getRWAdapter(state),
  }),
  null,
)(LayoutEmbedDataset);
