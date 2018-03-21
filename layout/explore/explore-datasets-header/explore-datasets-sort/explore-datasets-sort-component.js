import React from 'react';
import PropTypes from 'prop-types';

import { Tooltip } from 'wri-api-components';

// Components
import Icon from 'components/ui/Icon';

class ExploreDatasetsSortComponent extends React.Component {
  static propTypes = {
    selected: PropTypes.string,
    options: PropTypes.array,

    // Actions
    setSortSelected: PropTypes.func
  };

  render() {
    const {
      selected, options
    } = this.props;

    return (
      <div className="c-explore-datasets-sort">
        <Tooltip
          overlay="Sort options dropdown (TBD)"
          overlayClassName="c-rc-tooltip -default"
          placement="top"
          trigger={['click']}
          mouseLeaveDelay={0}
          destroyTooltipOnHide
        >
          <button
            className="actions-sort-button"
          >
            <span>{options.find(o => o.value === selected).label}</span>
          </button>
        </Tooltip>

        <button
          className="actions-sort-button"
        >
          <Icon className="-small" name="icon-arrow-down" />
        </button>
      </div>
    );
  }
}

export default ExploreDatasetsSortComponent;
