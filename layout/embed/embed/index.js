import { connect } from 'react-redux';

// actions
import { setIfFavorited } from 'redactions/widget';

// component
import LayoutEmbedEmbed from './component';

export default connect(
  (state) => ({
    widget: state.widget.data,
    loading: state.widget.loading,
    error: state.widget.error,
    favourited: state.widget.favourite.favourited,
    user: state.user,
  }),
  {
    setIfFavorited,
  },
)(LayoutEmbedEmbed);
