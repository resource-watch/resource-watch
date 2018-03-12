import React from 'react';
import PropTypes from 'prop-types';

// Redux
import { connect } from 'react-redux';

import CollectionsForm from 'components/app/myrw/collections/form/CollectionsForm';

function CollectionsEdit(props) {
  const { user, id } = props;

  const { collections } = user;
  const collection = id === 'new' ? 'new' : collections.items.filter(col => col.id === id)[0];

  return (
    <div className="c-collections-edit">
      {!collection && <h5>collection not found</h5>}
      {collection && <CollectionsForm collection={collection} />}
    </div>
  );
}

CollectionsEdit.propTypes = {
  user: PropTypes.object.isRequired,
  id: PropTypes.string.isRequired
};

const mapStateToProps = state => ({
  user: state.user
});

export default connect(mapStateToProps, null)(CollectionsEdit);
