import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { toastr } from 'react-redux-toastr';

// services
import { deleteWidget } from 'services/widget';

class DeleteAction extends PureComponent {
  static propTypes = {
    user: PropTypes.object.isRequired,
    data: PropTypes.object.isRequired,
    onRowDelete: PropTypes.func.isRequired,
  }

  handleOnClickDelete = () => {
    const {
      data: { id, name, dataset },
      user: { token },
    } = this.props;

    toastr.confirm(`Are you sure that you want to delete: "${name}"`, {
      onOk: () => {
        deleteWidget(id, dataset, token)
          .then(() => {
            this.props.onRowDelete(id);
            toastr.success('Success', `The widget "${id}" - "${name}" has been removed correctly`);
          })
          .catch((err) => {
            toastr.error('Error', `The widget "${id}" - "${name}" was not deleted. Try again. ${err}`);
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

DeleteAction.propTypes = {
  data: PropTypes.object,
  authorization: PropTypes.string,
  onRowDelete: PropTypes.func,
};

export default DeleteAction;
