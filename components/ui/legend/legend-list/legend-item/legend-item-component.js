import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

// Components
import LegendItemType from './legend-item-type';
import LegendItemDrag from './legend-item-drag';
import LegendItemTimeline from './legend-item-timeline';
import LegendItemButtons from './legend-item-buttons';

class LegendItem extends PureComponent {
  static propTypes = {
    dataset: PropTypes.string,
    layers: PropTypes.array,
    hideTimeline: PropTypes.bool
  }

  static defaultProps = {
    dataset: '',
    layers: []
  }

  render() {
    const { layers, hideTimeline } = this.props;
    const activeLayer = layers.find(l => l.active);

    return (
      <li className="c-legend-unit">
        <div className="legend-info">
          <header className="legend-item-header">
            <h3>
              <span className="name">{activeLayer.name}</span>
            </h3>

            <LegendItemButtons
              {...this.props}
              activeLayer={activeLayer}
            />
          </header>

          <LegendItemType
            activeLayer={activeLayer}
          />

          {!hideTimeline && <LegendItemTimeline
            {...this.props}
          />}

        </div>

        <LegendItemDrag />
      </li>
    );
  }
}

export default LegendItem;
