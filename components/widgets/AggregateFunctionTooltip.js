import React from 'react';
import PropTypes from 'prop-types';
import { Autobind } from 'es-decorators';

// Redux

import { connect } from 'react-redux';
import { toggleTooltip } from 'redactions/tooltip';

// Components
import Button from 'components/ui/Button';

const AGGREGATE_FUNCTIONS = [
  'sum', 'avg', 'max', 'min', 'count', 'none'
];
const AGGREGATE_FUNCTIONS_ONLY_COUNT = ['count', 'none'];

class AggregateFunctionTooltip extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      // null (store) === none (state)
      aggregateFunction: !props.aggregateFunction ? 'none' : props.aggregateFunction
    };
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.triggerMouseDown);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.triggerMouseDown);
  }

  onApply() {
    this.props.onApply(this.state.aggregateFunction);

    // We close the tooltip
    this.props.toggleTooltip(false);
  }

  @Autobind
  triggerMouseDown(e) {
    const el = document.querySelector('.c-tooltip');
    const clickOutside = el && el.contains && !el.contains(e.target);
    if (clickOutside) {
      this.props.toggleTooltip(false);
    }
  }

  @Autobind
  handleInputChange(event) {
    this.setState({ aggregateFunction: event.target.value });
  }

  render() {
    const { aggregateFunction } = this.state;
    const { onlyCount } = this.props;
    const functions = onlyCount ? AGGREGATE_FUNCTIONS_ONLY_COUNT : AGGREGATE_FUNCTIONS;
    return (
      <div className="c-aggregate-function-tooltip">
        Aggregate functions
        <div>
          {functions.map((val, i) =>
            (
              <div className="radio-button" key={val}>
                <input
                  id={`radio-aggregate-${i}`}
                  type="radio"
                  name="functions"
                  value={val}
                  onChange={this.handleInputChange}
                  checked={val === aggregateFunction}
                />
                <label htmlFor={`radio-aggregate-${i}`}>{val}</label>
              </div>
            )
          )}
        </div>
        <Button
          properties={{ type: 'button', className: '-primary -compressed' }}
          onClick={() => this.onApply()}
        >
          Done
        </Button>
      </div>
    );
  }
}

AggregateFunctionTooltip.propTypes = {
  onlyCount: PropTypes.bool.isRequired,
  onApply: PropTypes.func.isRequired,
  aggregateFunction: PropTypes.string,
  // store
  toggleTooltip: PropTypes.func.isRequired
};

const mapDispatchToProps = dispatch => ({
  toggleTooltip: (opened, opts) => {
    dispatch(toggleTooltip(opened, opts));
  }
});

export default connect(null, mapDispatchToProps)(AggregateFunctionTooltip);
