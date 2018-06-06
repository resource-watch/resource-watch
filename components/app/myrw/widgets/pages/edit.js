import React from 'react';
import PropTypes from 'prop-types';
import { toastr } from 'react-redux-toastr';

// Redux
import { connect } from 'react-redux';

import { setDataset } from 'redactions/myrwdetail';

// Services
import WidgetService from 'services/WidgetService';
import DatasetService from 'services/DatasetService';

// Components
import Spinner from 'components/ui/Spinner';
import WidgetEditor from 'widget-editor';
import Button from 'components/ui/Button';
import Input from 'components/form/Input';
import Field from 'components/form/Field';

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

class WidgetsEdit extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      submitting: false,
      widget: null,
      dataset: null // Data associated with the dataset
    };

    this.widgetService = new WidgetService(this.props.id,
      { apiURL: process.env.WRI_API_URL });

    // ------------------- Bindings -----------------------
    this.onSubmit = this.onSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.onUpdateWidget = this.onUpdateWidget.bind(this);
    // ----------------------------------------------------
  }

  componentDidMount() {
    this.widgetService.fetchData()
      .then((data) => {
        this.setState({ widget: data });
        return data.attributes.dataset;
      })
      .then((datasetId) => {
        const datasetService = new DatasetService(datasetId, {
          apiURL: process.env.WRI_API_URL,
          language: this.props.locale
        });

        return datasetService.fetchData('metadata')
          .then((dataset) => {
            this.setState({ dataset });
            const datasetName = dataset.attributes.metadata && dataset.attributes.metadata[0] &&
              dataset.attributes.metadata[0].attributes.info &&
              dataset.attributes.metadata[0].attributes.info.name ?
              dataset.attributes.metadata[0].attributes.info.name : dataset.attributes.name;
            this.props.setDataset({ id: dataset.id, name: datasetName });
          });
      })
      // TODO: handle the error in the UI
      .catch(err => toastr.error('Error', err))
      .then(() => this.setState({ loading: false }));
  }

  componentWillUnmount() {
    this.props.setDataset(null);
  }

  async onSubmit(event) {
    if (event) event.preventDefault();

    this.setState({ loading: true });

    const { widget } = this.state;
    const widgetAtts = widget.attributes;
    const dataset = widgetAtts.dataset;
    const { user } = this.props;
    const widgetConfig = (this.onGetWidgetConfig) ? await this.getWidgetConfig() : {};

    const widgetObj = Object.assign(
      {},
      {
        id: widget.id,
        application: widgetAtts.application,
        name: widgetAtts.name,
        description: widgetAtts.description,
        caption: widgetAtts.caption
      },
      { widgetConfig }
    );

    this.widgetService.updateUserWidget(widgetObj, dataset, user.token)
      .then((response) => {
        if (response.errors) {
          const errorMessage = response.errors[0].detail;
          this.setState({
            saved: false,
            loading: false,
            error: true,
            errorMessage
          });
          toastr.error('Error', errorMessage);
        } else {
          this.setState({
            saved: true,
            loading: false,
            error: false
          });
          toastr.success('Success', 'Widget updated successfully!');
        }
      }).catch((err) => {
        this.setState({
          saved: false,
          error: true,
          loading: false
        });
        toastr.error('Error', err);
      });
  }

  /**
   * Event handler executed when the user clicks the "Save widget"
   * button of the widget editor
   *
   */
  onUpdateWidget() {
    // We can't directly call this.onSubmit otherwise the form won't be
    // validated. We can't execute this.form.submit either because the
    // validation is not always triggered (see MDN). One solution is as
    // following: simulating a click on the submit button to trigger the
    // validation and eventually save the changes
    if (this.form) this.form.querySelector('button[type="submit"]').click();
  }

  getWidgetConfig() {
    return this.onGetWidgetConfig()
      .then(widgetConfig => widgetConfig)
      .catch(() => ({}));
  }

  handleChange(value) {
    const newWidgetAtts = Object.assign({}, this.state.widget.attributes, value);
    const newWidgetObj = Object.assign({}, this.state.widget, { attributes: newWidgetAtts });
    this.setState({ widget: newWidgetObj });
  }

  render() {
    const { loading, widget, submitting } = this.state;
    const widgetAtts = widget && widget.attributes;
    const datasetId = widgetAtts && widgetAtts.dataset;
    return (
      <div className="c-myrw-widgets-edit">
        <Spinner
          className="-light"
          isLoading={loading}
        />
        {widget &&
        <div>
          <WidgetEditor
            datasetId={datasetId}
            widgetId={widget.id}
            saveButtonMode="never"
            embedButtonMode="never"
            titleMode="never"
            provideWidgetConfig={(func) => { this.onGetWidgetConfig = func; }}
          />
          <div className="form-container">
            <form ref={(node) => { this.form = node; }} className="form-container" onSubmit={this.onSubmit}>
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
                    default: widgetAtts.name,
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
                    default: widgetAtts.description,
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
                    className: '-a'
                  }}
                >
                  Save
                </Button>
              </div>
            </form>
          </div>
        </div>
        }
      </div>
    );
  }
}

WidgetsEdit.propTypes = {
  id: PropTypes.string.isRequired,
  // Store
  user: PropTypes.object.isRequired,
  locale: PropTypes.string.isRequired,
  // ACTIONS
  setDataset: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  user: state.user,
  locale: state.common.locale
});

const mapDispatchToProps = dispatch => ({
  setDataset: dataset => dispatch(setDataset(dataset))
});

export default connect(mapStateToProps, mapDispatchToProps)(WidgetsEdit);
