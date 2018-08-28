import React from 'react';
import PropTypes from 'prop-types';

import { Tooltip } from 'wri-api-components';

// Components
import Icon from 'components/ui/Icon';
import RadioGroup from 'components/form/RadioGroup';
import classnames from 'classnames';

class ExploreDatasetsSortComponent extends React.Component {
  static propTypes = {
    canChangeSortDirection: PropTypes.bool,
    selected: PropTypes.string,
    direction: PropTypes.number,
    options: PropTypes.array,

    // Actions
    setSortSelected: PropTypes.func,
    setSortIsUserSelected: PropTypes.func,
    setSortDirection: PropTypes.func,
    fetchDatasets: PropTypes.func
  };

  onSortSelected = (selected) => {
    this.props.setSortSelected(selected);
    if (selected === 'relevance') {
      this.props.setSortDirection(-1);
    }
    this.props.setSortIsUserSelected();
    this.props.fetchDatasets();
  }

  onSortDirection = () => {
    const { direction, canChangeSortDirection } = this.props;
    if (!canChangeSortDirection) {
      return;
    }
    this.props.setSortDirection(-direction);
    this.props.setSortIsUserSelected();
    this.props.fetchDatasets();
  }

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
      selected, direction, options, canChangeSortDirection
    } = this.props;

    return (
      <div className="c-explore-datasets-sort">
        <Tooltip
          overlay={
            <RadioGroup
              name="sort"
              properties={{ default: selected }}
              options={options}
              onChange={this.onSortSelected}
            />
          }
          overlayClassName="c-rc-tooltip -default"
          placement="top"
          trigger={['click']}
          mouseLeaveDelay={0}
          getTooltipContainer={this.getTooltipContainer}
          destroyTooltipOnHide
        >
          <button
            className="actions-sort-button"
          >
            <span>{options.find(o => o.value === selected).label}</span>
          </button>
        </Tooltip>

        <button
          className={classnames({
            'actions-sort-button': true,
            isInteractive: canChangeSortDirection
          })}
          onClick={this.onSortDirection}
        >
          {direction < 0 &&
            <Icon className="-small" name="icon-arrow-down" />
          }

          {direction > 0 &&
            <Icon className="-small" name="icon-arrow-up" />
          }
        </button>
      </div>
    );
  }
}

export default ExploreDatasetsSortComponent;
