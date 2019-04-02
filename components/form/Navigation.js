import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import Button from 'components/ui/Button';
import Spinner from 'components/ui/Spinner';

class Navigation extends PureComponent {
  static propTypes = {
    step: PropTypes.number.isRequired,
    stepLength: PropTypes.number.isRequired,
    submitting: PropTypes.bool.isRequired,
    hideCancel: PropTypes.bool,
    onStepChange: PropTypes.func.isRequired,
    onBack: PropTypes.func
  }

  static defaultProps = {
    hideCancel: false,
    onBack: null
  }
  constructor(props) {
    super(props);

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
    const { onBack } = this.props;
    if (onBack) return onBack();

    return window.history.go(-1);
  }

  render() {
    const { step, stepLength, submitting, hideCancel } = this.props;

    const submittingClassName = classnames({ '-submitting': submitting });

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
        {stepLength === 1 && !hideCancel &&
          <li>
            <Button
              properties={{
                type: 'button',
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
              {submitting && <Spinner className="-small -transparent -white-icon" isLoading={submitting} />}
              Save
            </Button>
          </li>
        }
      </ul>
    );
  }
}

export default Navigation;
