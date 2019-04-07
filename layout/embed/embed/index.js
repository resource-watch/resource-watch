import { connect } from 'react-redux';

// actions
import { getWidget, checkIfFavorited, setIfFavorited } from 'redactions/widget';

// component
import LayoutEmbedEmbed from './component';

export default connect(
  state => ({
    widget: state.widget.data,
    loading: state.widget.loading,
    error: state.widget.error,
    favourited: state.widget.favourite.favourited,
    user: state.user
  }),
  {
    getWidget,
    checkIfFavorited,
    setIfFavorited
  }
)(LayoutEmbedEmbed);
