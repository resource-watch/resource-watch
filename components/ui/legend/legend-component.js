import React from 'react';
import PropTypes from 'prop-types';


import { arrayMove } from 'react-sortable-hoc';

// Components
import Icon from 'components/ui/Icon';

import LegendList from './legend-list';

class Legend extends React.PureComponent {
  static propTypes = {
    layerGroups: PropTypes.array,
    expanded: PropTypes.bool,

    // ACTIONS
    setLayerGroupsOrder: PropTypes.func
  }

  static defaultProps = {
    layerGroups: [],
    expanded: true
  }

  state = {
    expanded: this.props.expanded
  }

  /**
   * UI EVENTS
   * onToggleLegend
   * onSortEnd
  */

  onToggleLegend = (bool) => {
    this.setState({ expanded: bool });
  }

  onSortEnd = ({ oldIndex, newIndex }) => {
    const layers = [...this.props.layerGroups];
    const datasets = arrayMove(layers, oldIndex, newIndex)
      .map(l => l.dataset);

    this.props.setLayerGroupsOrder && this.props.setLayerGroupsOrder(datasets);
  }


  render() {
    const { layerGroups } = this.props;

    return (
      <div className="c-legend-map">
        <div
          className={`open-legend ${this.state.expanded ? '-active' : ''}`}
          // onScroll={this.onScrollLegend}
        >
          {/* Toggle button */}
          <button type="button" className="toggle-legend" onClick={() => this.onToggleLegend(false)}>
            <Icon name="icon-arrow-down" className="-small" />
          </button>

          <LegendList
            items={layerGroups}
            helperClass="c-legend-unit -sort"
            onSortEnd={this.onSortEnd}
            axis="y"
            lockAxis="y"
            lockToContainerEdges
            lockOffset="50%"
            useDragHandle
            onChangeLayer={l => console.info(l)}
          />
        </div>

        <div className={`close-legend ${!this.state.expanded ? '-active' : ''}`}>
          <h1 className="legend-title">
            Legend

            {/* Toggle button */}
            <button type="button" className="toggle-legend" onClick={() => this.onToggleLegend(true)}>
              <Icon name="icon-arrow-up" className="-small" />
            </button>
          </h1>
        </div>
      </div>
    );
  }
}

export default Legend;
