import { connect } from 'react-redux';

import CollectionListAside from './collection-list-aside-component';
import { getParsedCollections } from './collection-list-aside-selector';

const mapStateToProps = state => ({
  collections: getParsedCollections(state)
});

export default connect(mapStateToProps, {})(CollectionListAside);
