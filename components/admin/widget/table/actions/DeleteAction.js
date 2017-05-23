import React from 'react';
import { remove } from '../../../../utils/request';

class DeleteAction extends React.Component {

  constructor(props) {
    super(props);

    // BINDINGS
    this.onClickDelete = this.onClickDelete.bind(this);
  }

  onClickDelete(e) {
    const { data } = this.props;
    e && e.preventDefault() && e.stopPropagation();

    if (data.dataset && data.id && confirm(`Are you sure that you want to delete the widget: "${data.name}" `)) {
      remove({
        url: `https://api.resourcewatch.org/v1/dataset/${data.dataset}/widget/${data.id}`,
        headers: [{
          key: 'Authorization',
          value: this.props.authorization
        }],
        onSuccess: () => {
          this.props.onRowDelete(data.id);
        },
        onError: () => {
          console.error('We can\'t delete the widget');
        }
      });
    }
  }

  render() {
    return (
      <span>
        <a onClick={this.onClickDelete} >
          Remove
        </a>
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
