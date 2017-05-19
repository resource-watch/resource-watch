import React from 'react';
import { remove } from 'utils/request';

class DeleteAction extends React.Component {

  constructor(props) {
    super(props);

    // BINDINGS
    this.handleOnClickDelete = this.handleOnClickDelete.bind(this);
  }

  handleOnClickDelete(e) {
    const { data } = this.props;
    e && e.preventDefault() && e.stopPropagation();

    if (confirm(`Are you sure that you want to delete the dataset: "${data.name}" `)) {
      remove({
        url: `https://api.resourcewatch.org/v1/dataset/${data.id}`,
        headers: [{
          key: 'Authorization',
          value: this.props.authorization
        }],
        onSuccess: () => {
          this.props.onRowDelete(data.id);
        },
        onError: () => {
          console.error('We can\'t delete the partner');
        }
      });
    }
  }

  render() {
    const { href } = this.props;
    return (
      <span>
        <a
          href={href}
          onClick={this.handleOnClickDelete}
        >
          Remove
        </a>
      </span>
    );
  }
}

DeleteAction.propTypes = {
  data: React.PropTypes.object,
  href: React.PropTypes.string,

  authorization: React.PropTypes.string,
  onRowDelete: React.PropTypes.func
};

export default DeleteAction;
