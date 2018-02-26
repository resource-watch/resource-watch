import React, { PureComponent } from 'react';

// Components
import LegendItemType from './legend-item-type';
import LegendItemDrag from './legend-item-drag';

class LegendItem extends PureComponent {
  render() {
    return (
      <li key={layerGroup.dataset} className="c-legend-unit">
        <div className="legend-info">
          <header className="legend-item-header">
            <h3 className={this.props.className.color}>
              <span className="name">{activeLayer.name}</span>
            </h3>
            {this.getItemsActions(layerGroup)}
          </header>

          <LegendItemType
            config={activeLayer.legendConfig}
            className={this.props.className}
          />
        </div>

        <LegendItemDrag />
      </li>
    );
  }
}

export default LegendItem;
