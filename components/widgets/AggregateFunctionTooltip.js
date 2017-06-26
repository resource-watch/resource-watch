import React from 'react';
import PropTypes from 'prop-types';
import { Autobind } from 'es-decorators';

// Redux
import { initStore } from 'store';
import withRedux from 'next-redux-wrapper';
import { toggleTooltip } from 'redactions/tooltip';

// Components
import Button from 'components/ui/Button';

const AGGREGATE_FUNCTIONS = [
  'sum', 'avg', 'max', 'min', 'none'
];

class AggregateFunctionTooltip extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      aggregateFunction: props.aggregateFunction
    };
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.triggerMouseDown);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.triggerMouseDown);
  }

  @Autobind
  triggerMouseDown(e) {
    const el = document.querySelector('.c-tooltip');
    const clickOutside = el && el.contains && !el.contains(e.target);
    if (clickOutside) {
      this.props.toggleTooltip(false);
    }
  }

  onApply() {
    this.props.onApply(this.state.aggregateFunction);

    // We close the tooltip
    this.props.toggleTooltip(false);
  }

  @Autobind
  handleInputChange(event) {
    this.setState({ aggregateFunction: event.target.value });
  }

  render() {
    const { aggregateFunction } = this.state;
    return (
      <div className="c-aggregate-function-tooltip">
        Aggregate functions
        <div>
          {AGGREGATE_FUNCTIONS.map((val, i) =>
            (
              <div className="radio-button">
                <input
                  id={`radio${i}`}
                  type="radio"
                  name="functions"
                  value={val}
                  onChange={this.handleInputChange}
                  checked={val === aggregateFunction}
                />
                <label
                  htmlFor={`radio${i}`}
                >
                  {val}
                </label>
              </div>
            )
          )}
        </div>
        <Button
          properties={{ type: 'button', className: '-primary' }}
          onClick={() => this.onApply()}
        >
          Done
        </Button>
      </div>
    );
  }
}

AggregateFunctionTooltip.propTypes = {
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

export default withRedux(initStore, null, mapDispatchToProps)(AggregateFunctionTooltip);
