import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { toastr } from 'react-redux-toastr';

// services
import { deleteLayer } from 'services/LayersService';

class DeleteAction extends PureComponent {
  static propTypes = {
    data: PropTypes.object,
    user: PropTypes.object.isRequired,
    onRowDelete: PropTypes.func.isRequired
  };

  static defaultProps = { data: {} };

  handleOnClickDelete = () => {
    const {
      data: { id, name, dataset },
      user: { token },
      onRowDelete
    } = this.props;

    toastr.confirm(`Are you sure that you want to delete: "${name}"`, {
      onOk: () => {
        deleteLayer(id, dataset, token)
          .then(() => {
            onRowDelete(id);
            toastr.success('Success', `The layer "${id}" - "${name}" has been removed correctly`);
          })
          .catch((err) => {
            toastr.error(
              'Error',
              `The layer "${id}" - "${name}" was not deleted. Try again. ${err}`
            );
          });
      }
    });
  };

  render() {
    return (
      <span>
        <button className="c-btn" onClick={this.handleOnClickDelete}>
          Remove
        </button>
      </span>
    );
  }
}

export default DeleteAction;
