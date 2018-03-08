import React from 'react';
import PropTypes from 'prop-types';

// SERVICES
import CollectionsService from 'services/collections-service';
import { toastr } from 'react-redux-toastr';

// Redux
import { connect } from 'react-redux';

import { getUserCollections } from 'redactions/user';

class DeleteAction extends React.Component {
  constructor(props) {
    super(props);

    // BINDINGS
    this.handleOnClickDelete = this.handleOnClickDelete.bind(this);
  }

  handleOnClickDelete(e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    const { data, authorization } = this.props;

    toastr.confirm(`Are you sure that you want to delete: "${data.attributes.name}"`, {
      onOk: () => {
        CollectionsService.deleteCollection(authorization, data.id).then(() => {
          toastr.success('Success', 'Collection succesfully removed.');
          this.props.dispatch(getUserCollections());
        }, () => {
          toastr.error('Error', 'Could not remove collection at this time.');
        });
      }
    });
  }

  render() {
    return (
      <span>
        <a className="c-btn" href="#delete-dataset" onClick={this.handleOnClickDelete}> Remove </a>
      </span>
    );
  }
}

DeleteAction.propTypes = {
  data: PropTypes.object,
  authorization: PropTypes.string,
  dispatch: PropTypes.func
};

const mapStateToProps = state => ({
  user: state.user
});

export default connect(mapStateToProps, null)(DeleteAction);
