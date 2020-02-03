import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

class PreviewTD extends PureComponent {
  static propTypes = {
    value: PropTypes.bool.isRequired,
    index: PropTypes.string.isRequired
  }

  render() {
    const { value, index } = this.props;

    return (
      <td key={index}>
        <a target="_blank" rel="noopener noreferrer" href={`/dashboards/${value}`}>
          {`${window.location.origin}/dashboards/${value}`}
        </a>
      </td>
    );
  }
}

export default PreviewTD;
