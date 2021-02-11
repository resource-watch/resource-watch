import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { toastr } from 'react-redux-toastr';

// services
import { deleteDataset } from 'services/dataset';

class DeleteAction extends PureComponent {
  static propTypes = {
    data: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
    onRowDelete: PropTypes.func.isRequired,
  }

  handleOnClickDelete = () => {
    const {
      data: { id, name },
      user: { token },
      onRowDelete,
    } = this.props;

    toastr.confirm(`Are you sure that you want to delete: "${name}"`, {
      onOk: () => {
        deleteDataset(id, token)
          .then(() => {
            onRowDelete(id);
            toastr.success('Success', `The dataset "${id}" - "${name}" has been removed correctly`);
          })
          .catch((err) => {
            try {
              err.map((er) => toastr.error('Error', `The dataset "${id}" - "${name}" was not deleted. ${er.detail}`));
            } catch (e) {
              toastr.error('Error', `The dataset "${id}" - "${name}" was not deleted. Try again.`);
            }
          });
      },
    });
  }

  render() {
    return (
      <span>
        <button
          className="c-btn"
          onClick={this.handleOnClickDelete}
        >
          Remove
        </button>
      </span>
    );
  }
}

export default DeleteAction;
