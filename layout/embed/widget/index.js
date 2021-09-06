import { connect } from 'react-redux';

// component
import LayoutEmbedWidget from './component';

export default connect(
  (state) => ({
    widget: state.widget.data,
    error: state.widget.error,
    bandDescription: state.widget.bandDescription,
    bandStats: state.widget.bandStats,
  }),
  null,
)(LayoutEmbedWidget);
