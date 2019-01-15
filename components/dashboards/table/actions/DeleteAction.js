import React from 'react';
import PropTypes from 'prop-types';

// Services
import DashboardsService, { deleteDashboard } from 'services/DashboardsService';
import { toastr } from 'react-redux-toastr';

class DeleteAction extends React.Component {
  constructor(props) {
    super(props);

    // BINDINGS
    this.handleOnClickDelete = this.handleOnClickDelete.bind(this);

    // SERVICES
    this.service = new DashboardsService({
      authorization: props.authorization
    });
  }

  handleOnClickDelete(e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    const {
      data: { name, id },
      authorization
    } = this.props;

    toastr.confirm(`Are you sure that you want to delete: "${name}"`, {
      onOk: () => {
        console.log(this.props);
        console.log(deleteDashboard);
        deleteDashboard(id, authorization)
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

DeleteAction.propTypes = {
  data: PropTypes.object,
  authorization: PropTypes.string,
  onRowDelete: PropTypes.func
};

export default DeleteAction;
