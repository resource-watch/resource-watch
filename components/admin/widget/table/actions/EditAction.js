import React from 'react';

class EditAction extends React.Component {

  parseHref() {
    const { action, data } = this.props;
    const { dataset, id } = data;
    const path = action.path;
    return path.replace(':id', id).replace(':dataset_id', dataset);
  }

  render() {
    return (
      <span>
        <a href={this.parseHref()}>
          Edit
        </a>
      </span>
    );
  }
}

EditAction.propTypes = {
  data: React.PropTypes.object,
  action: React.PropTypes.object
};

export default EditAction;
