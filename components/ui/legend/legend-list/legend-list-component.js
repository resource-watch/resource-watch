import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

// Components
import LegendListItem from './legend-item-component';

class Legend extends PureComponent {
  static propTypes = {
    items: PropTypes.array
  }

  static defaultProps = {
    items: []
  }

  render() {
    const { items } = this.props;

    return (
      <ul className="legend-list">
        {items.map((value, index) =>
          <LegendListItem key={value.key} index={index} value={value} />)
        }
      </ul>
    );
  }
}

export default Legend;
