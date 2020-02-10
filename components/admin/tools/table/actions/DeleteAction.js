import React from 'react';
import PropTypes from 'prop-types';

// Services
import { deleteTool } from 'services/tools';
import { toastr } from 'react-redux-toastr';

class DeleteAction extends React.Component {
  handleOnClickDelete = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    const { data, authorization } = this.props;

    toastr.confirm(`Are you sure that you want to delete: "${data.title}"`, {
      onOk: () => {
        deleteTool(data.id, authorization)
          .then(() => {
            this.props.onRowDelete(data.id);
            toastr.success('Success', `The tool "${data.id}" - "${data.title}" has been removed correctly`);
          })
          .catch((err) => {
            toastr.error('Error', `The tool "${data.id}" - "${data.title}" was not deleted. Try again. ${err}`);
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
  data: PropTypes.object.isRequired,
  authorization: PropTypes.string.isRequired,
  onRowDelete: PropTypes.func.isRequired
};

export default DeleteAction;
