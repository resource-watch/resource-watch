import React from 'react';
import PropTypes from 'prop-types';
import { toastr } from 'react-redux-toastr';

// Redux
import { connect } from 'react-redux';

import { setDataset } from 'redactions/myrwdetail';

// Services
import {
  fetchWidget,
  updateWidget,
  updateWidgetMetadata,
  createWidgetMetadata,
  fetchWidgetMetadata
} from 'services/widget';
import { fetchDataset } from 'services/dataset';

// Widget Editor
import WidgetEditor from '@widget-editor/widget-editor';
import RwAdapter from '@widget-editor/rw-adapter';

// Utils
import DefaultTheme from 'utils/widgets/theme';

// Components
import Spinner from 'components/ui/Spinner';
import Button from 'components/ui/Button';
import Input from 'components/form/Input';
import Field from 'components/form/Field';

const FORM_ELEMENTS = {
  elements: {},
  validate() {
    const { elements } = this;
    Object.keys(elements).forEach((k) => {
      elements[k].validate();
    });
  },
  isValid() {
    const { elements } = this;
    const valid = Object.keys(elements)
      .map(k => elements[k].isValid())
      .filter(v => v !== null)
      .every(element => element);

    return valid;
  }
};

class WidgetsEdit extends React.Component {
  state = {
    loading: true,
    submitting: false,
    widget: null,
    caption: null,
    name: null
  };

  UNSAFE_componentWillMount() {
    const { id } = this.props;
    fetchWidget(id)
      .then((data) => {
        this.setState({ widget: data });
        return data.dataset;
      })
      .then(datasetId =>
        fetchDataset(datasetId, { includes: 'metadata' })
          .then((dataset) => {
            const datasetName = dataset.metadata && dataset.metadata[0] &&
              dataset.metadata[0].info &&
              dataset.metadata[0].info.name ?
              dataset.metadata[0].info.name : dataset.name;
            this.props.setDataset({ id: dataset.id, name: datasetName });
          }))
      // TODO: handle the error in the UI
      .catch(err => toastr.error('Error', err))
      .then(() => this.setState({ loading: false }));
  }

  componentWillUnmount() {
    this.props.setDataset(null);
  }

  onSubmit = async (event) => {
    if (event) event.preventDefault();

    this.setState({ loading: true });
    const { widget, name } = this.state;
    const widgetAtts = widget.attributes;
    const { dataset } = widgetAtts;
    const { user } = this.props;
    const widgetConfig = (this.onGetWidgetConfig) ? await this.getWidgetConfig() : {};

    const metadata = {
      language: this.props.locale,
      info: {
        caption: this.state.caption,
        widgetLinks: []
      },
      application: process.env.APPLICATIONS
    };

    const widgetObj = Object.assign(
      {},
      {
        id: widget.id,
        application: widgetAtts.application,
        name,
        description: widgetAtts.description
      },
      { widgetConfig }
    );

    const hasMetadata = await fetchWidgetMetadata(widgetObj.id, dataset, user.token);

    updateWidget(widgetObj, user.token)
      .then(() => {
        if (hasMetadata.data.length > 0) {
          updateWidgetMetadata(
            widgetObj,
            dataset,
            metadata,
            user.token
          ).then(() => {
            this.setState({ loading: false });
            toastr.success('Success', 'Widget updated successfully!');
          });
        } else {
          createWidgetMetadata(
            widgetObj.id,
            dataset,
            metadata,
            user.token
          ).then(() => {
            this.setState({ loading: false });
            toastr.success('Success', 'Widget updated successfully!');
          });
        }
      }).catch((err) => {
        this.setState({ loading: false });
        toastr.error('Error', err);
      });
  }

  /**
   * Event handler executed when the user clicks the "Save widget"
   * button of the widget editor
   *
   */
  onUpdateWidget = () => {
    // We can't directly call this.onSubmit otherwise the form won't be
    // validated. We can't execute this.form.submit either because the
    // validation is not always triggered (see MDN). One solution is as
    // following: simulating a click on the submit button to trigger the
    // validation and eventually save the changes
    if (this.form) this.form.querySelector('button[type="submit"]').click();
  }

  // onEditWidget(type, value) {
  //   this.setState({ [type]: value });
  // }

  getWidgetConfig() {
    return this.onGetWidgetConfig()
      .then(widgetConfig => widgetConfig)
      .catch(() => ({}));
  }

  handleChange = (value) => {
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
            application="rw"
            onSave={this.onSaveWidget}
            theme={DefaultTheme}
            adapter={RwAdapter}
          />
          {/* <WidgetEditor
            datasetId={datasetId}
            widgetId={widget.id}
            saveButtonMode="never"
            embedButtonMode="never"
            titleMode="auto"
            provideWidgetConfig={(func) => { this.onGetWidgetConfig = func; }}
            onChangeWidgetTitle={name => this.onEditWidget('name', name)}
            onChangeWidgetCaption={capt => this.onEditWidget('caption', capt)}
          /> */}
          <div className="form-container">
            <form ref={(node) => { this.form = node; }} className="form-container" onSubmit={this.onSubmit}>
              <fieldset className="c-field-container">

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

const mapDispatchToProps = { setDataset };

export default connect(mapStateToProps, mapDispatchToProps)(WidgetsEdit);
