import { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { toastr } from 'react-redux-toastr';

// services
import { deleteLayer } from 'services/layer';

class DeleteAction extends PureComponent {
  handleOnClickDelete = () => {
    const {
      data: { id, name, dataset },
      token,
      onRowDelete,
    } = this.props;

    toastr.confirm(`Are you sure that you want to delete: "${name}"`, {
      onOk: () => {
        deleteLayer(id, dataset, `Bearer ${token}`)
          .then(() => {
            onRowDelete(id);
            toastr.success('Success', `The layer "${id}" - "${name}" has been removed correctly`);
          })
          .catch((err) => {
            toastr.error(
              'Error',
              `The layer "${id}" - "${name}" was not deleted. Try again. ${err.message}`,
            );
          });
      },
    });
  }

  render() {
    return (
      <button
        type="button"
        className="c-btn"
        onClick={this.handleOnClickDelete}
      >
        Remove
      </button>
    );
  }
}

DeleteAction.defaultProps = {
  data: {},
};

DeleteAction.propTypes = {
  token: PropTypes.string.isRequired,
  data: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    dataset: PropTypes.string,
  }),
  onRowDelete: PropTypes.func.isRequired,
};

export default DeleteAction;
