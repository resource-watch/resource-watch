import React from 'react';
import PropTypes from 'prop-types';

class ColumnDetails extends React.Component {
  constructor(props) {
    super(props);
    this.onClick = this.onClick.bind(this);
  }

  componentDidMount() {
    window.addEventListener('click', this.onClick);
  }

  componentWillUnmount() {
    window.removeEventListener('click', this.onClick);
  }

  /**
   * Event handler executed when the user clicks
   * somewhere in the page
   */
  onClick() {
    this.props.onClose();
  }

  render() {
    return (
      <div // eslint-disable-line jsx-a11y/no-static-element-interactions
        // We don't need to add any accessibility feature here
        // because the event listener is just to prevent the
        // tooltip from being closed
        ref={(node) => { this.el = node; }}
        className="c-column-details"
        onClick={e => e.stopPropagation()}
      >
        <h4>{this.props.name}</h4>
        <p>{this.props.description}</p>
      </div>
    );
  }
}

ColumnDetails.defaultProps = {
  description: 'No description is available.'
};

ColumnDetails.propTypes = {
  name: PropTypes.string,
  description: PropTypes.string,
  onClose: PropTypes.func.isRequired
};

export default ColumnDetails;
