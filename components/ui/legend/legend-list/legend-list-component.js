import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

// Components
import LegendListItem from './legend-item';

class Legend extends PureComponent {
  static propTypes = {
    items: PropTypes.array,

    // FUNC
    onChangeLayer: PropTypes.func,
    onChangeOpacity: PropTypes.func,
    onChangeVisibility: PropTypes.func
  }

  static defaultProps = {
    items: []
  }

  render() {
    const { items } = this.props;

    return (
      <ul className="legend-list">
        {items.map((value, index) => (
          <LegendListItem
            index={index}
            value={value}
            onChangeLayer={this.props.onChangeLayer}
            onChangeOpacity={this.props.onChangeOpacity}
            onChangeVisibility={this.props.onChangeVisibility}
          />
        ))}
      </ul>
    );
  }
}

export default Legend;
