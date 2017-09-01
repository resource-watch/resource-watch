import React from 'react';
import PropTypes from 'prop-types';
import { toastr } from 'react-redux-toastr';

// Services
import WidgetsService from 'services/WidgetsService';

class DeleteAction extends React.Component {
  constructor(props) {
    super(props);

    // BINDINGS
    this.handleOnClickDelete = this.handleOnClickDelete.bind(this);

    // SERVICES
    this.service = new WidgetsService({
      authorization: props.authorization
    });
  }

  handleOnClickDelete(e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    const { data } = this.props;

    toastr.confirm(`Are you sure that you want to delete: "${data.name}"`, {
      onOk: () => {
        this.service.deleteData({ id: data.id, dataset: data.dataset })
          .then(() => {
            this.props.onRowDelete(data.id);
            toastr.success('Success', `The widget "${data.id}" - "${data.name}" has been removed correctly`);
          })
          .catch((err) => {
            toastr.error('Error', `The widget "${data.id}" - "${data.name}" was not deleted. Try again. ${err}`);
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
