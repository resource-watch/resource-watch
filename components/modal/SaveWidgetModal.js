import React from 'react';
import PropTypes from 'prop-types';
import { Autobind } from 'es-decorators';

// Redux
import withRedux from 'next-redux-wrapper';
import { initStore } from 'store';

// Components
import Field from 'components/form/Field';
import Input from 'components/form/Input';
import Button from 'components/ui/Button';
import Spinner from 'components/ui/Spinner';

// Services
import WidgetService from 'services/WidgetService';

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
      loading: false,
      widget: {}
    };

    this.widgetService = new WidgetService(null, {
      apiURL: process.env.WRI_API_URL
    });
  }

  @Autobind
  onSubmit(event) {
    event.preventDefault();

    this.setState({
      loading: true
    }, () => {

    });

    const { limit, value, category, color, size, orderBy, aggregateFunction } = this.props.widgetEditor;

    const widgetConfig = {
      paramsConfig: {
        limit,
        value,
        category,
        color,
        size,
        orderBy,
        aggregateFunction
      }
    };
    const widgetObj = Object.assign({}, this.state.widget, widgetConfig);

    this.widgetService.saveUserWidget(widgetObj, this.props.dataset, this.props.user.token)
      .then((response) => {
        console.log('response', response);
      }).catch((err) => {
        console.log(err);
      });
  }

  @Autobind
  handleChange(value) {
    const newWidgetObj = Object.assign({}, this.state.widget, value);
    this.setState({ widget: newWidgetObj });
  }

  render() {
    const { submitting, loading } = this.state;

    return (
      <div className="c-save-widget-modal">
        <h1 className="c-text -header-normal -thin title">Save widget</h1>
        <Spinner
          isLoading={loading}
          className="-light -relative"
        />
        <form className="c-form" onSubmit={this.onSubmit}>
          <fieldset className="c-field-container">
            <Field
              ref={(c) => { if (c) FORM_ELEMENTS.elements.title = c; }}
              onChange={value => this.handleChange({ name: value })}
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
                title: 'description',
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
    );
  }
}

SaveWidgetModal.propTypes = {
  dataset: PropTypes.string.isRequired,
  // Store
  user: PropTypes.object.isRequired,
  widgetEditor: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  user: state.user,
  widgetEditor: state.widgetEditor
});


export default withRedux(initStore, mapStateToProps, null)(SaveWidgetModal);
