import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import Tooltip from 'rc-tooltip/dist/rc-tooltip';

// Components
import Icon from 'components/ui/Icon';

class ExploreDatasetsHeaderComponent extends React.Component {
  static propTypes = {
    mode: PropTypes.string,
    total: PropTypes.number,

    // Actions
    setDatasetsMode: PropTypes.func
  };

  render() {
    const {
      mode, total
    } = this.props;

    return (
      <div className="c-explore-datasets-header">
        <div className="total">
          {total} datasets
        </div>

        <div className="actions">
          <div className="actions-sort">
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
                <span>Last modified</span>
                <Icon className="-small" name="icon-arrow-down" />
              </button>
            </Tooltip>
          </div>

          <div className="actions-mode">
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
        </div>
      </div>
    );
  }
}

export default ExploreDatasetsHeaderComponent;
