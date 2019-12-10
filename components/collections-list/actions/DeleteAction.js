import React from 'react';
import PropTypes from 'prop-types';

// SERVICES
import CollectionsService from 'services/collections';
import { toastr } from 'react-redux-toastr';

// Redux
import { connect } from 'react-redux';

import { getUserCollections } from 'redactions/user';

function DeleteAction(props) {
  const handleOnClickDelete = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    const { data, authorization, dispatch } = props;

    toastr.confirm(`Are you sure that you want to delete: "${data.name}"`, {
      onOk: () => {
        CollectionsService.deleteCollection(authorization, data.id).then(() => {
          toastr.success('Success', 'Collection succesfully removed.');
          dispatch(getUserCollections());
        }, () => {
          toastr.error('Error', 'Could not remove collection at this time.');
        });
      }
    });
  };

  return (
    <span>
      <a className="c-btn" href="#delete-dataset" onClick={handleOnClickDelete}> Remove </a>
    </span>
  );
}

DeleteAction.propTypes = {
  data: PropTypes.object.isRequired,
  authorization: PropTypes.string.isRequired,
  dispatch: PropTypes.func.isRequired
};

const mapStateToProps = state => ({ user: state.user });

export default connect(mapStateToProps, null)(DeleteAction);
