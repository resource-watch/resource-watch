import React from 'react';
import PropTypes from 'prop-types';

// Redux
import { connect } from 'react-redux';

import CollectionsList from 'components/collections-list';

function CollectionsIndex(props) {
  const { collections } = props.user;
  return (
    <div className="c-collections-index">
      <CollectionsList routes={{ detail: 'myrw_detail' }} collections={collections} />
    </div>
  );
}

CollectionsIndex.propTypes = {
  user: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  user: state.user
});

export default connect(mapStateToProps, null)(CollectionsIndex);
