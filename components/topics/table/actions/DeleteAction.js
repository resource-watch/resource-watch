import React from 'react';
import PropTypes from 'prop-types';

// Services
import { deleteTopic } from 'services/topics';
import { toastr } from 'react-redux-toastr';

class DeleteAction extends React.Component {
  static propTypes = {
    data: PropTypes.object.isRequired,
    authorization: PropTypes.string.isRequired,
    onRowDelete: PropTypes.func.isRequired
  }

  handleOnClickDelete = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    const { data, authorization } = this.props;

    toastr.confirm(`Are you sure that you want to delete: "${data.name}"`, {
      onOk: () => {
        deleteTopic(data.id, authorization)
          .then(() => {
            this.props.onRowDelete(data.id);
            toastr.success('Success', `The topic "${data.id}" - "${data.name}" has been removed correctly`);
          })
          .catch((err) => {
            toastr.error('Error', `The topic "${data.id}" - "${data.name}" was not deleted. Try again. ${err}`);
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

export default DeleteAction;
