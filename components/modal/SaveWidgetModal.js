import React from 'react';
import PropTypes from 'prop-types';
import { Autobind } from 'es-decorators';

// Redux
import withRedux from 'next-redux-wrapper';
import { initStore } from 'store';
import { toggleModal } from 'redactions/modal';

// Components
import Field from 'components/form/Field';
import Input from 'components/form/Input';
import Button from 'components/ui/Button';
import Spinner from 'components/ui/Spinner';

// Services
import WidgetService from 'services/WidgetService';

// utils
import { getChartConfig } from 'utils/widgets/WidgetHelper';

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
      saved: false,
      widget: {}
    };

    this.widgetService = new WidgetService(null, {
      apiURL: process.env.WRI_API_URL
    });
  }

  @Autobind
  handleCancel() {
    this.props.toggleModal(false);
  }

  @Autobind
  onSubmit(event) {
    event.preventDefault();

    this.setState({
      loading: true
    }, () => {

    });
    const { widgetEditor, tableName, dataset } = this.props;
    const { limit, value, category, color, size, orderBy, aggregateFunction } = widgetEditor;

    const widgetConfig = { widgetConfig: Object.assign(
      {},
      { paramsConfig: {
          limit,
          value,
          category,
          color,
          size,
          orderBy,
          aggregateFunction
        }
      },
      getChartConfig(widgetEditor, tableName, dataset)
    )};
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
    const { submitting, loading, saved } = this.state;

    return (
      <div className="c-save-widget-modal">
        {!saved &&
        <h1 className="c-text -header-normal -thin title">Save widget</h1>
        }
        {saved &&
        <h1 className="c-text -header-normal -thin title -green">Subscription saved</h1>
        }
        <Spinner
          isLoading={loading}
          className="-light -relative"
        />
        {!saved &&
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
                  disabled: submitting,
                  className: '-secondary'
                }}
                onClick={this.handleCancel}
              >
                  Cancel
                </Button>
            </div>
          </form>
        }
      </div>
    );
  }
}

SaveWidgetModal.propTypes = {
  dataset: PropTypes.string.isRequired,
  tableName: PropTypes.string.isRequired,
  // Store
  user: PropTypes.object.isRequired,
  widgetEditor: PropTypes.object.isRequired,
  toggleModal: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  user: state.user,
  widgetEditor: state.widgetEditor
});

const mapDispatchToProps = dispatch => ({
  toggleModal: (open) => { dispatch(toggleModal(open)); }
});


export default withRedux(initStore, mapStateToProps, mapDispatchToProps)(SaveWidgetModal);
