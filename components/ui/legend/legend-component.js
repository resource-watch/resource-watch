import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import { arrayMove } from 'react-sortable-hoc';

// Components
import Icon from 'components/ui/Icon';

import LegendList from './legend-list';

class Legend extends React.PureComponent {
  static propTypes = {
    layerGroups: PropTypes.array,
    expanded: PropTypes.bool,
    readonly: PropTypes.bool,
    interaction: PropTypes.bool,

    // ACTIONS
    onChangeLayer: PropTypes.func,
    onChangeVisibility: PropTypes.func,
    onChangeOpacity: PropTypes.func,
    onChangeOrder: PropTypes.func,
    onRemoveLayer: PropTypes.func
  }

  static defaultProps = {
    layerGroups: [],
    expanded: true,
    readonly: false,
    interaction: true,

    // FUNCTIONS
    onChangeLayer: l => console.info(l),
    onChangeVisibility: (l, v) => console.info(l, v),
    onChangeOpacity: (l, o) => console.info(l, o),
    onChangeOrder: ids => console.info(ids),
    onRemoveLayer: l => console.info(l)
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
    const layersDatasets = arrayMove(layers, oldIndex, newIndex)
      .map(l => l.dataset);

    this.props.onChangeOrder(layersDatasets);
  }


  render() {
    const { layerGroups } = this.props;

    return (
      <div className="c-legend-map">
        <div
          className={`open-legend ${classnames({ '-active': this.state.expanded })}`}
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
            readonly={this.props.readonly}
            interaction={this.props.interaction}
            onChangeLayer={this.props.onChangeLayer}
            onChangeOpacity={this.props.onChangeOpacity}
            onChangeVisibility={this.props.onChangeVisibility}
            onRemoveLayer={this.props.onRemoveLayer}
          />
        </div>

        <div
          className={`close-legend ${classnames({ '-active': !this.state.expanded })}`}
          onClick={() => this.onToggleLegend(true)}
        >
          <h1 className="legend-title">
            Legend

            {/* Toggle button */}
            <button type="button" className="toggle-legend">
              <Icon name="icon-arrow-up" className="-small" />
            </button>
          </h1>
        </div>
      </div>
    );
  }
}

export default Legend;
