import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

class Field extends PureComponent {
  static propTypes = {
    properties: PropTypes.object.isRequired,
    hint: PropTypes.string,
    className: PropTypes.string,
    button: PropTypes.node,
    children: PropTypes.any.isRequired
  }

  static defaultProps = {
    hint: null,
    button: null,
    className: null
  }

  constructor(props) {
    super(props);

    this.state = {
      valid: null,
      error: []
    };
  }

  onValid = (valid, error) => {
    this.setState({
      valid,
      error
    });
  }

  validate() {
    this.child.triggerValidate();
  }

  isValid() {
    return this.state.valid;
  }

  render() {
    const { properties, children, className, hint, button } = this.props;
    const { valid, error } = this.state;

    // Set classes
    const fieldClasses = classnames({
      [className]: !!className,
      '-disabled': properties.disabled,
      '-valid': (valid === true),
      '-error': (valid === false)
    });

    return (
      <div className={`c-field ${fieldClasses}`}>
        {properties.label &&
          <label htmlFor={`input-${properties.name}`} className="label">
            {properties.label} {properties.required && <abbr title="required">*</abbr>}
          </label>
        }

        {hint &&
          <p className="hint" dangerouslySetInnerHTML={{ __html: hint }} />
        }

        <div className="field-container">
          {React.isValidElement(children) && children}
          {children && typeof children === 'function' &&
            <this.props.children
              {...this.props}
              ref={(c) => { if (c) this.child = c; }}
              onValid={this.onValid}
            />}

          {!!button &&
            button
          }
        </div>

        {error &&
          error.map((err, i) => {
            if (err) {
              return (
                <p key={i} className="error">
                  {err.message || err.detail}
                </p>
              );
            }
            return null;
          })
        }

      </div>
    );
  }
}

export default Field;
