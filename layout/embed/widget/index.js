import { connect } from 'react-redux';

// actions
import { getWidget, checkIfFavorited, setIfFavorited } from 'redactions/widget';

// constants
import {
  getRWAdapter,
} from 'utils/widget-editor';

// component
import LayoutEmbedWidget from './component';

export default connect(
  (state) => ({
    widget: state.widget.data,
    loading: state.widget.loading,
    error: state.widget.error,
    bandDescription: state.widget.bandDescription,
    bandStats: state.widget.bandStats,
    favourited: state.widget.favourite.favourited,
    user: state.user,
    webshot: state.common.webshot,
    RWAdapter: getRWAdapter(state),
  }),
  {
    getWidget,
    checkIfFavorited,
    setIfFavorited,
  },
)(LayoutEmbedWidget);
