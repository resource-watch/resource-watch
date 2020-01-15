import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

// Redux
import { connect } from 'react-redux';

// Services
import { deleteDashboard } from 'services/dashboard';
import { toastr } from 'react-redux-toastr';

class DeleteAction extends PureComponent {
  static propTypes = {
    data: PropTypes.object.isRequired,
    onRowDelete: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired
  }

  handleOnClickDelete = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    const {
      data: { name, id },
      user: { token }
    } = this.props;

    toastr.confirm(`Are you sure that you want to delete: "${name}"`, {
      onOk: () => {
        deleteDashboard(id, token)
          .then(() => {
            this.props.onRowDelete(id);
            toastr.success('Success', `The dashboard "${id}" - "${name}" has been removed correctly`);
          })
          .catch((err) => {
            toastr.error('Error', `The dashboard "${id}" - "${name}" was not deleted. Try again. ${err}`);
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

const mapStateToProps = state => ({ user: state.user });

export default connect(mapStateToProps, null)(DeleteAction);
