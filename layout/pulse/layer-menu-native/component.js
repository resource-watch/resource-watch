import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import findIndex from 'lodash/findIndex';

import Icon from 'components/ui/Icon';

class LayerMenuNativeComponent extends PureComponent {
  render() {
    const { layers, triggerClick } = this.props;
    return (
      <div className="c-layer-menu-native">
        <select
          onChange={(event) => {
            const { value } = event.target;
            if (value === -1) {
              triggerClick(null);
            } else {
              layers.forEach((g) => {
                const index = findIndex(g.layers, layer => event.target.value === layer.label);
                if (index !== -1) {
                  triggerClick(g.layers[index]);
                }
              });
            }
          }}
        >
          <option value={-1}>Select a layer</option>
          {layers.map(group => (
            <optgroup label={group.label} key={group.label}>
              {group.layers.map(layer => (
                <option
                  value={layer.label}
                  key={layer.label}
                >
                  {layer.label}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
        <Icon name="icon-arrow-down-2" className="arrow" />
      </div>
    );
  }
}

LayerMenuNativeComponent.propTypes = {
  layers: PropTypes.array,
  triggerClick: PropTypes.func
};

export default LayerMenuNativeComponent;
