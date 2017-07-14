import React from 'react';
import PropTypes from 'prop-types';
// Services
import LayersService from 'services/LayersService';

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
    e && e.preventDefault() && e.stopPropagation();
    const { data } = this.props;

    if (confirm(`Are you sure that you want to delete: "${data.name}" `)) {
      this.service.deleteData({ id: data.id, dataset: data.dataset })
        .then(() => {
          this.props.onRowDelete(data.id);
        })
        .catch((err) => {
          console.error('There was an error with the request. The object was not deleted');
        });
    }
  }

  render() {
    const { data } = this.props;

    return (
      <span>
        <a href={`/admin/data/layers/${data.id}/remove`} onClick={this.handleOnClickDelete}> Remove </a>
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
