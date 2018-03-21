import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import { Tooltip } from 'wri-api-components';

// Components
import Icon from 'components/ui/Icon';

class ExploreDatasetsSortComponent extends React.Component {
  static propTypes = {
    mode: PropTypes.string,

    // Actions
    setDatasetsMode: PropTypes.func
  };

  getTooltipContainer() {
    if (typeof window !== 'undefined' && typeof document !== 'undefined') {
      if (document.querySelector('.sidebar-content')) {
        return document.querySelector('.sidebar-content');
      }

      return document.body;
    }

    return null;
  }

  render() {
    const {
      mode
    } = this.props;

    return (
      <div className="c-explore-datasets-mode">
        <Tooltip
          overlay="Grid mode"
          overlayClassName="c-rc-tooltip -default"
          placement="top"
          trigger={['hover', 'click']}
          mouseLeaveDelay={0}
          getTooltipContainer={this.getTooltipContainer}
          destroyTooltipOnHide
        >
          <button
            className={classnames({
              'actions-mode-button': true,
              '-active': (mode === 'grid')
            })}
            onClick={() => this.props.setDatasetsMode('grid')}
          >
            <Icon name="icon-view-grid" />
          </button>
        </Tooltip>

        <Tooltip
          overlay="List mode"
          overlayClassName="c-rc-tooltip -default"
          placement="top"
          trigger={['hover', 'click']}
          getTooltipContainer={this.getTooltipContainer}
          mouseLeaveDelay={0}
          destroyTooltipOnHide
        >
          <button
            className={classnames({
              'actions-mode-button': true,
              '-active': (mode === 'list')
            })}
            onClick={() => this.props.setDatasetsMode('list')}
          >
            <Icon name="icon-view-list" />
          </button>
        </Tooltip>
      </div>
    );
  }
}

export default ExploreDatasetsSortComponent;
