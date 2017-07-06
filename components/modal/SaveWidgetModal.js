import React from 'react';
import { Autobind } from 'es-decorators';

// Components
import Field from 'components/form/Field';
import Input from 'components/form/Input';
import Button from 'components/ui/Button';

const FORM_ELEMENTS = {
  elements: {
  },
  validate() {
    const elements = this.elements;
    Object.keys(elements).forEach((k) => {
      elements[k].validate();
    });
  },
  isValid() {
    const elements = this.elements;
    const valid = Object.keys(elements)
      .map(k => elements[k].isValid())
      .filter(v => v !== null)
      .every(element => element);

    return valid;
  }
};


class SaveWidgetModal extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      submitting: false,
      loading: false
    };
  }

  @Autobind
  onSubmit() {
    event.preventDefault();
    this.setState({
      loading: true
    });
  }

  @Autobind
  handleChange(value) {
    this.setState(value);
  }

  render() {

    const { submitting } = this.state;

    return (
      <div className="c-save-widget-modal">
        <h1 className="c-text -header-normal -thin title">Save widget</h1>
        <div className="container">
          <form className="c-form" onSubmit={this.onSubmit} noValidate>
            <fieldset className="c-field-container">
              <Field
                ref={(c) => { if (c) FORM_ELEMENTS.elements.title = c; }}
                onChange={value => this.handleChange({ title: value })}
                validations={['required']}
                properties={{
                  title: 'title',
                  label: 'Title',
                  type: 'text',
                  required: true,
                  placeholder: 'Widget title'
                }}
              >
                {Input}
              </Field>
              <Field
                ref={(c) => { if (c) FORM_ELEMENTS.elements.description = c; }}
                onChange={value => this.handleChange({ description: value })}
                properties={{
                  description: 'description',
                  label: 'Description',
                  type: 'text',
                  placeholder: 'Widget description'
                }}
              >
                {Input}
              </Field>
            </fieldset>
            <div className="buttons-container">
              <Button
                properties={{
                  type: 'submit',
                  disabled: submitting,
                  className: '-primary'
                }}
              >
                Save
              </Button>
              <Button
                properties={{
                  type: 'submit',
                  disabled: submitting,
                  className: '-secondary'
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

SaveWidgetModal.propTypes = {
};


export default SaveWidgetModal;
