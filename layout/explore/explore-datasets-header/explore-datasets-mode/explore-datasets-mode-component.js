import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import { Tooltip } from 'vizzuality-components';

// Components
import Icon from 'components/ui/icon';

class ExploreDatasetsSortComponent extends PureComponent {
  static propTypes = {
    mode: PropTypes.string.isRequired,
    setDatasetsMode: PropTypes.func.isRequired,
  };

  render() {
    const { mode } = this.props;

    return (
      <div className="c-explore-datasets-mode">
        <Tooltip
          overlay="Grid mode"
          overlayClassName="c-rc-tooltip -default"
          placement="top"
          trigger={['hover', 'click']}
          mouseLeaveDelay={0}
          destroyTooltipOnHide
        >
          <button
            className={classnames({
              'actions-mode-button': true,
              '-active': (mode === 'grid'),
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
          mouseLeaveDelay={0}
          destroyTooltipOnHide
        >
          <button
            className={classnames({
              'actions-mode-button': true,
              '-active': (mode === 'list'),
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
