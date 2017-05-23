import React from 'react';

class EditAction extends React.Component {

  parseHref() {
    const { action, data } = this.props;
    const { id, dataset } = data;
    let path = action.path;
    // I know, improvable
    path = path.replace(':dataset_id', dataset);
    path = path.replace(':id', id);

    return path;
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
