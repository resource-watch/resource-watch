import React from 'react';
import PropTypes from 'prop-types';

// Services
import LayersService from 'services/LayersService';
import { toastr } from 'react-redux-toastr';

class DeleteAction extends React.Component {
  constructor(props) {
    super(props);

    // BINDINGS
    this.handleOnClickDelete = this.handleOnClickDelete.bind(this);

    // SERVICES
    this.service = new LayersService({
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
            toastr.success('Success', `The layer "${data.id}" - "${data.name}" has been removed correctly`);
          })
          .catch((err) => {
            toastr.error('Error', `The layer "${data.id}" - "${data.name}" was not deleted. Try again. ${err}`);
          });
      }
    });
  }

  render() {
    const { data } = this.props;

    return (
      <span>
        <a className="c-btn" href={`/admin/data/layers/${data.id}/remove`} onClick={this.handleOnClickDelete}> Remove </a>
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
