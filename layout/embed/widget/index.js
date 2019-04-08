import { connect } from 'react-redux';

// actions
import { getWidget, checkIfFavorited, setIfFavorited } from 'redactions/widget';

// component
import LayoutEmbedWidget from './component';

export default connect(
  state => ({
    widget: state.widget.data,
    loading: state.widget.loading,
    error: state.widget.error,
    bandDescription: state.widget.bandDescription,
    bandStats: state.widget.bandStats,
    favourited: state.widget.favourite.favourited,
    user: state.user,
    webshot: state.common.webshot
  }),
  {
    getWidget,
    checkIfFavorited,
    setIfFavorited
  }
)(LayoutEmbedWidget);
