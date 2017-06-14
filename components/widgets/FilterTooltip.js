import React from 'react';

class FilterTooltip extends React.Component {

  constructor(props) {
    super(props);

  }

  render() {
    return (
      <div className="c-filter-tooltip">
        Tooltip
      </div>
    );
  }
}

FilterTooltip.propTypes = {
  // Define the chart data
  value: React.PropTypes.object
};

export default FilterTooltip;
