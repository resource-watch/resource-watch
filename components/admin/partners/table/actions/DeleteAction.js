import React from 'react';
import PropTypes from 'prop-types';

// Services
import PartnersService from 'services/PartnersService';
import { toastr } from 'react-redux-toastr';

class DeleteAction extends React.Component {

  constructor(props) {
    super(props);

    // BINDINGS
    this.handleOnClickDelete = this.handleOnClickDelete.bind(this);

    // SERVICES
    this.service = new PartnersService({
      authorization: props.authorization
    });
  }

  handleOnClickDelete(e) {
    e && e.preventDefault() && e.stopPropagation();

    const { data } = this.props;

    toastr.confirm(`Are you sure that you want to delete: "${data.name}"`, {
      onOk: () => {
        this.service.deleteData(data.id)
          .then(() => {
            this.props.onRowDelete(data.id);
            toastr.success('Success', `The partner "${data.id}" - "${data.name}" has been removed correctly`);
          })
          .catch((err) => {
            toastr.error('Error', `The partner "${data.id}" - "${data.name}" was not deleted. Try again`);
            console.error(err);
          });
      },
      onCancel: () => console.info('canceled')
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
