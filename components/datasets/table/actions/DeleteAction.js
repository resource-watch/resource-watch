import React from 'react';

// SERVICES
import DatasetsService from 'services/DatasetsService';
import { toastr } from 'react-redux-toastr';


class DeleteAction extends React.Component {

  constructor(props) {
    super(props);

    // BINDINGS
    this.handleOnClickDelete = this.handleOnClickDelete.bind(this);

    // SERVICES
    this.service = new DatasetsService({
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
            toastr.success('Success', `The dataset "${data.id}" - "${data.name}" has been removed correctly`);
          })
          .catch((err) => {
            toastr.error('Error', `The dataset "${data.id}" - "${data.name}" was not deleted. Try again`);
            console.error(err);
          });
      },
      onCancel: () => console.info('canceled')
    });
  }

  render() {
    return (
      <span>
        <a href="#delete-dataset" onClick={this.handleOnClickDelete}> Remove </a>
      </span>
    );
  }
}

DeleteAction.propTypes = {
  data: React.PropTypes.object,

  authorization: React.PropTypes.string,
  onRowDelete: React.PropTypes.func
};

export default DeleteAction;
