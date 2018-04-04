// Redux
import { connect } from 'react-redux';

import { toggleFavourite } from 'redactions/user';

// Selectors
import { parseFavourites } from 'selectors/user/favorites';
import ToggleFavoriteComponent from './toggle-favorite-component';

const mapStateToProps = state => ({
  user: state.user,
  favourites: parseFavourites(state)
});

const mapDispatchToProps = dispatch => ({
  toggleFavourite: fav => dispatch(toggleFavourite(fav))
});

export default connect(mapStateToProps, mapDispatchToProps)(ToggleFavoriteComponent);
