import React from 'react';

class Field extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      value: this.props.properties.default,
      valid: null,
      error: []
    };

    // BINDINGS
    this.onValid = this.onValid.bind(this);
  }

  /**
   * UI EVENTS
   * - onValid (valid, error)
  */
  onValid(valid, error) {
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
    const { properties, hint } = this.props;
    const { valid, error } = this.state;

    // Set classes
    const validClass = valid === true ? '-valid' : '';
    const errorClass = valid === false ? '-error' : '';

    return (
      <div className={`c-field ${validClass} ${errorClass}`}>
        {properties.label &&
          <label htmlFor={`input-${properties.name}`} className="label">
            {properties.label} {properties.required && <abbr title="required">*</abbr>}
          </label>
        }

        {hint &&
          <p className="hint" dangerouslySetInnerHTML={{ __html: hint }} />
        }

        <this.props.children
          {...this.props}
          ref={(c) => { if (c) this.child = c; }}
          onValid={this.onValid}
        />

        {error &&
          error.map((err, i) => {
            if (err) {
              return (
                <p key={i} className="error">
                  {err.message}
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

Field.propTypes = {
  properties: React.PropTypes.object.isRequired,
  hint: React.PropTypes.string
};

export default Field;
