import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { Tooltip } from 'vizzuality-components';

// Utils
import { logEvent } from 'utils/analytics';
import { getTooltipContainer } from 'utils/tooltip';

// Components
import Icon from 'components/ui/icon';
import RadioGroup from 'components/form/RadioGroup';
import classnames from 'classnames';

class ExploreDatasetsSortComponent extends PureComponent {
  static propTypes = {
    canChangeSortDirection: PropTypes.bool.isRequired,
    selected: PropTypes.string.isRequired,
    direction: PropTypes.number.isRequired,
    options: PropTypes.array.isRequired,
    setSortSelected: PropTypes.func.isRequired,
    setSortIsUserSelected: PropTypes.func.isRequired,
    setSortDirection: PropTypes.func.isRequired,
    fetchDatasets: PropTypes.func.isRequired
  };

  onSortSelected = (selected) => {
    const {
      setSortSelected,
      setSortDirection,
      setSortIsUserSelected,
      fetchDatasets
    } = this.props;

    setSortSelected(selected);
    if (selected === 'relevance') {
      setSortDirection(-1);
    }
    setSortIsUserSelected();
    fetchDatasets();
    logEvent('Explore Menu', 'Change Sort Option', selected);
  }

  onSortDirection = () => {
    const {
      direction,
      canChangeSortDirection,
      setSortDirection,
      setSortIsUserSelected,
      fetchDatasets
    } = this.props;

    if (!canChangeSortDirection) {
      return;
    }
    setSortDirection(-direction);
    setSortIsUserSelected();
    fetchDatasets();
  }

  render() {
    const {
      selected,
      direction,
      options,
      canChangeSortDirection
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
          getTooltipContainer={getTooltipContainer}
          destroyTooltipOnHide
        >
          <button
            className="actions-sort-button"
          >
            <span>{`SORT BY ${options.find(o => o.value === selected).label.toUpperCase()}`}</span>
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
