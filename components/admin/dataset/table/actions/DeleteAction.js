import React from 'react';
import { remove } from 'utils/request';

class DeleteAction extends React.Component {

  constructor(props) {
    super(props);

    // BINDINGS
    this.handleOnClickDelete = this.handleOnClickDelete.bind(this);
  }

  handleOnClickDelete(e) {
    e && e.preventDefault() && e.stopPropagation();

    const { data, authorization } = this.props;

    if (confirm(`Are you sure that you want to delete: "${data.name}" `)) {
      remove({
        url: `${process.env.WRI_API_URL}/dataset/${data.id}`,
        headers: [{
          key: 'Authorization',
          value: authorization
        }],
        onSuccess: () => {
          this.props.onRowDelete(data.id);
        },
        onError: () => {
          console.error('There was an error with the request. The object was not deleted');
        }
      });
    }
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
