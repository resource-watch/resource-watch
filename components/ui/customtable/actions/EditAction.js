import React from 'react';
import PropTypes from 'prop-types';

class EditAction extends React.Component {
  parseHref() {
    const { action, data } = this.props;
    const id = data.id;
    const path = action.path;

    return path.replace(':id', id);
  }

  render() {
    return (
      <span>
        <a href={this.parseHref()} className="c-btn">
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
