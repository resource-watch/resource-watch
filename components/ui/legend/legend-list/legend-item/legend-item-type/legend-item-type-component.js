import React from 'react';
import PropTypes from 'prop-types';

class LegendItemType extends React.Component {
  static propTypes = {
    // PROPS
    activeLayer: PropTypes.object
  };

  getLegendItemType() {
    const { activeLayer } = this.props;

    switch (activeLayer.legendConfig.type) {
      case 'basic': {
        const { items } = activeLayer.legendConfig;

        return (
          <div className={`type -${activeLayer.legendConfig.type}`}>
            <div className="type-list">
              {items.map(item => (
                <div className="type-list-item" key={`type-list-item-${item.value || item.name}`}>
                  <span className="color" style={{ background: item.color }} />
                  <span className="name">{item.name || item.value}{activeLayer.legendConfig.unit}</span>
                </div>
              ))}
            </div>
          </div>
        );
      }

      case 'gradient': {
        const { items } = activeLayer.legendConfig;
        // Gradient & values
        const gradient = items.map(item => item.color);
        const values = [items[0], items[items.length - 1]];

        return (
          <div className={`type -${activeLayer.legendConfig.type}`}>
            <div className="type-list">
              <div className="type-list-item" style={{ width: '100%', backgroundImage: `linear-gradient(to right, ${gradient.join(',')})` }}>
                <span className="color" />
              </div>
            </div>
            <div className="type-list">
              {values.map(item => (
                <div className="type-list-item" key={`type-list-item-${item.value || item.name}`}>
                  <span className="value">{item.value || item.name}{activeLayer.legendConfig.unit}</span>
                </div>
              ))}
            </div>
          </div>
        );
      }


      case 'choropleth': {
        return (
          <div className={`type -${activeLayer.legendConfig.type}`}>
            <div className="type-list">
              {activeLayer.legendConfig.items.map(item => (
                <div
                  className="type-list-item"
                  style={{ width: `${100 / activeLayer.legendConfig.items.length}%` }}
                  key={`type-list-item-${item.name || item.value}`}
                >
                  <span className="color" style={{ background: item.color }} />
                </div>
              ))}
            </div>
            <div className="type-list">
              {activeLayer.legendConfig.items.map(item => (
                <div
                  className="type-list-item"
                  style={{ width: `${100 / activeLayer.legendConfig.items.length}%` }}
                  key={`type-list-item-${item.name || item.value}`}
                >
                  <span className="value">{item.value || item.name}</span>
                </div>
              ))}
            </div>
          </div>
        );
      }

      default:
        console.warn('No legend type specified');
        return null;
    }
  }

  render() {
    return (
      <div className="c-legend-type">
        {this.getLegendItemType()}
      </div>
    );
  }
}

export default LegendItemType;
