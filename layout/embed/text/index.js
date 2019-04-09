import { connect } from 'react-redux';

// actions
import { getWidget } from 'redactions/widget';

// component
import LayoutEmbedText from './component';

export default connect(
  state => ({
    widget: state.widget.data,
    loading: state.widget.loading,
    bandDescription: state.widget.bandDescription,
    bandStats: state.widget.bandStats,
    webshot: state.common.webshot,
    routes: state.routes
  }),
  { getWidget }
)(LayoutEmbedText);
