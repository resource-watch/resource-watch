import React from 'react';
import PropTypes from 'prop-types';

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
        <a className="c-btn" href={this.parseHref()}>
          Edit
        </a>
      </span>
    );
  }
}

EditAction.propTypes = {
  data: PropTypes.object,
  action: PropTypes.object
};

export default EditAction;
