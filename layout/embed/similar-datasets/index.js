import { connect } from 'react-redux';

// component
import LayoutEmbedSimilarDatasets from './component';

export default connect(
  (state) => ({
    loading: state.similarDatasets.loading,
  }),
  null,
)(LayoutEmbedSimilarDatasets);
