import React from 'react';

import Button from '../ui/Button';

class Navigation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      step: props.step,
      stepLength: props.stepLength
    };

    this.onStepChange = this.onStepChange.bind(this);
  }

  /**
   * UI EVENTS
   * - onStepChange
  */
  onStepChange(e) {
    e.preventDefault();

    // Send the step to the form
    if (this.props.onStepChange) this.props.onStepChange(this.props.step - 1);
  }

  render() {
    const { step, stepLength, submitting } = this.props;
    return (
      <ul className="c-field-buttons">
        {step !== 1 &&
          <li>
            <Button
              properties={{
                type: 'button',
                name: 'commit',
                className: '-primary'
              }}
              onClick={this.onStepChange}
            >
              Back
            </Button>
          </li>
        }
        {step !== stepLength &&
          <li>
            <Button
              properties={{
                type: 'submit',
                name: 'commit',
                className: '-secondary'
              }}
            >
              Next
            </Button>
          </li>
        }
        {step === stepLength &&
          <li>
            <Button
              properties={{
                type: 'submit',
                name: 'commit',
                disabled: submitting,
                className: `-secondary ${submitting ? '-disabled' : ''}`
              }}
            >
              Submit
            </Button>
          </li>
        }
      </ul>
    );
  }
}

Navigation.propTypes = {
  step: React.PropTypes.number,
  stepLength: React.PropTypes.number,
  submitting: React.PropTypes.bool,
  onStepChange: React.PropTypes.func
};

export default Navigation;
