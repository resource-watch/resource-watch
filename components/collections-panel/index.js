import { connect } from 'react-redux';
import { addCollection, toggleFavourite, toggleCollection } from 'redactions/user';
import { parseFavourites } from 'selectors/user/favorites';

import Component from './collections-panel-component';

import { parseCollections } from './collections-panel-selectors';


const mapStateToProps = state => ({
  collections: parseCollections(state),
  favourites: parseFavourites(state),
  collectionsLoadingQueue: state.user.collections.loadingQueue,
  favouritesLoading: state.user.favourites.loading
});

const mapDispatchToProps = ({
  addCollection,
  toggleCollection,
  toggleFavourite
});

export default connect(mapStateToProps, mapDispatchToProps)(Component);
