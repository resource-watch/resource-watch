import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

class PreviewTD extends PureComponent {
  static propTypes = { value: PropTypes.string.isRequired }

  render() {
    const { value } = this.props;
    return (
      <td key={value}>
        <a target="_blank" rel="noopener noreferrer" href={`/topics/${value}`}>
          {`${window.location.origin}/topics/${value}`}
        </a>
      </td>
    );
  }
}

export default PreviewTD;
