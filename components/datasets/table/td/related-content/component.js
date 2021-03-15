import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

// components
import DatasetsRelatedContent from 'components/datasets/common/DatasetsRelatedContent';

class RelatedContentTD extends PureComponent {
  static propTypes = {
    row: PropTypes.object.isRequired,
    route: PropTypes.string.isRequired,
  }

  render() {
    const { row, route } = this.props;

    return (
      <td>
        <DatasetsRelatedContent
          dataset={row}
          route={route}
        />
      </td>
    );
  }
}

export default RelatedContentTD;
