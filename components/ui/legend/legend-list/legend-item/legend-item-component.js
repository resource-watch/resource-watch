import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

// Components
import LegendItemType from './legend-item-type';
import LegendItemDrag from './legend-item-drag';
import LegendItemButtons from './legend-item-buttons';

class LegendItem extends PureComponent {
  static propTypes = {
    dataset: PropTypes.string,
    layers: PropTypes.array
  }

  static defaultProps = {
    dataset: '',
    layers: []
  }

  render() {
    const { dataset, layers } = this.props;
    const activeLayer = layers.find(l => l.active);

    return (
      <li key={dataset} className="c-legend-unit">
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
        </div>

        <LegendItemDrag />
      </li>
    );
  }
}

export default LegendItem;
