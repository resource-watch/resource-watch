import { connect } from 'react-redux';

// component
import LayoutEmbedText from './component';

export default connect(
  (state) => ({
    widget: state.widget.data,
    loading: state.widget.loading,
    bandDescription: state.widget.bandDescription,
    bandStats: state.widget.bandStats,
    webshot: state.common.webshot,
  }),
  null,
)(LayoutEmbedText);
