import React from 'react';
import classnames from 'classnames';

import Button from '../ui/Button';

class Navigation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      step: props.step,
      stepLength: props.stepLength
    };

    this.onStepChange = this.onStepChange.bind(this);
    this.onBack = this.onBack.bind(this);
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

  onBack(e) {
    e.preventDefault();

    window.history.back();
  }

  render() {
    const { step, stepLength, submitting } = this.props;
    const submittingClassName = classnames({
      '-submitting': submitting
    });

    return (
      <ul className="c-field-buttons">
        {step !== 1 &&
          <li>
            <Button
              properties={{
                type: 'button',
                name: 'commit',
                className: '-secondary -expanded'
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
                className: '-primary -expanded'
              }}
            >
              Next
            </Button>
          </li>
        }
        {stepLength === 1 &&
          <li>
            <Button
              properties={{
                type: 'submit',
                name: 'commit',
                className: '-secondary -expanded'
              }}
              onClick={this.onBack}
            >
              Cancel
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
                className: `-primary -expanded ${submittingClassName}`
              }}
            >
              Save
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
