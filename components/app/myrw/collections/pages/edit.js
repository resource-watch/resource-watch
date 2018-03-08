import React from 'react';
import PropTypes from 'prop-types';

// Redux
import { connect } from 'react-redux';

import CollectionsForm from 'components/app/myrw/collections/form/CollectionsForm';

import { Link } from 'routes';

function CollectionsEdit(props) {
  const { user, subtab } = props;
  const { collections } = user;

  const collection = collections.items.filter(col => col.id === subtab)[0];

  return (
    <div className="c-collections-edit">
      {!collection && <h5>collection not found</h5>}

      {collection &&
      <div>
        <Link
          route="myrw"
          params={{ tab: 'collections' }}
        >
          <a className="c-btn">Back</a>
        </Link>

        <CollectionsForm />

      </div>}
    </div>
  );
}

CollectionsEdit.propTypes = {
  user: PropTypes.object.isRequired,
  subtab: PropTypes.string.isRequired
};

const mapStateToProps = state => ({
  user: state.user
});

export default connect(mapStateToProps, null)(CollectionsEdit);
