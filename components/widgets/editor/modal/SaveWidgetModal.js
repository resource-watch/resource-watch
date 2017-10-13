import React from 'react';
import PropTypes from 'prop-types';
import { Router } from 'routes';
import { Autobind } from 'es-decorators';
import { toastr } from 'react-redux-toastr';

// Redux
import { connect } from 'react-redux';
import { setTitle } from 'components/widgets/editor/redux/widgetEditor';
import { toggleModal } from 'redactions/modal';

// Components
import Field from 'components/widgets/editor/form/Field';
import Input from 'components/widgets/editor/form/Input';
import Button from 'components/widgets/editor/ui/Button';
import Spinner from 'components/widgets/editor/ui/Spinner';

// Services
import WidgetService from 'components/widgets/editor/services/WidgetService';

// utils
import { getChartConfig, getChartInfo } from 'components/widgets/editor/helpers/WidgetHelper';

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
      error: false,
      description: null // Description of the widget
    };

    this.widgetService = new WidgetService(null, {
      apiURL: process.env.WRI_API_URL
    });
  }


  @Autobind
  async onSubmit(event) {
    event.preventDefault();

    this.setState({
      loading: true
    });

    const { description } = this.state;
    const { widgetEditor, tableName, dataset, datasetType, datasetProvider } = this.props;
    const {
      limit,
      value,
      category,
      color,
      size,
      orderBy,
      aggregateFunction,
      chartType,
      filters,
      areaIntersection,
      visualizationType,
      band,
      layer,
      title,
      zoom,
      latLng
    } = widgetEditor;

    let chartConfig = {};

    // If the visualization if a map, we don't have any chartConfig
    if (visualizationType !== 'map') {
      const chartInfo = getChartInfo(dataset, datasetType, datasetProvider, widgetEditor);

      try {
        chartConfig = await getChartConfig(
          dataset,
          datasetType,
          tableName,
          band,
          datasetProvider,
          chartInfo
        );
      } catch (err) {
        this.setState({
          saved: false,
          error: true,
          errorMessage: 'Unable to generate the configuration of the chart'
        });

        return;
      }
    }

    const widgetConfig = {
      widgetConfig: Object.assign(
        {},
        // If the widget is a map, we want to add some extra info
        // in widgetConfig so the widget is compatible with other
        // apps that use the same API
        // The type and layer_id are not necessary for the editor
        // because it is already saved in widgetConfig.paramsConfig
        (
          visualizationType === 'map'
            ? { type: 'map', layer_id: layer && layer.id, zoom, ...latLng }
            : {}
        ),
        {
          paramsConfig: {
            visualizationType,
            limit,
            value,
            category,
            color,
            size,
            orderBy,
            aggregateFunction,
            chartType,
            filters,
            areaIntersection,
            band: band && { name: band.name },
            layer: layer && layer.id
          }
        },
        chartConfig
      )
    };

    const widgetObj = Object.assign(
      {},
      {
        name: title || null,
        description
      },
      widgetConfig
    );

    this.widgetService.saveUserWidget(widgetObj, this.props.dataset, this.props.user.token)
      .then((response) => {
        if (response.errors) throw new Error(response.errors[0].detail);
      })
      .then(() => this.setState({ saved: true, error: false }))
      .catch((err) => {
        this.setState({
          saved: false,
          error: true,
          errorMessage: err.message
        });
        toastr.error('Error', err); // eslint-disable-line no-console
      })
      .then(() => this.setState({ loading: false }));
  }

  /**
   * Event handler executed when the user clicks the
   * cancel button of the modal
   *
   */
  @Autobind
  handleCancel() {
    this.props.toggleModal(false);
  }

  /**
   * Event handler executed when the user clicks the
   * "Check my widgets" button
   */
  @Autobind
  handleGoToMyRW() {
    this.props.toggleModal(false);
    Router.pushRoute('myrw', { tab: 'widgets', subtab: 'my_widgets' });
  }

  render() {
    const { submitting, loading, saved, error, errorMessage } = this.state;
    const { widgetEditor } = this.props;

    return (
      <div className="c-save-widget-modal">
        {!saved &&
        <h2>Save widget</h2>
        }
        {saved &&
        <h2>Widget saved!</h2>
        }
        <Spinner
          isLoading={loading}
          className="-light -relative"
        />
        {error &&
        <div className="error-container">
          <div>Error</div>
          {errorMessage}
        </div>
        }
        {!saved &&
          <form className="form-container" onSubmit={this.onSubmit}>
            <fieldset className="c-field-container">
              <Field
                ref={(c) => { if (c) FORM_ELEMENTS.elements.title = c; }}
                onChange={value => this.props.setTitle(value)}
                validations={['required']}
                properties={{
                  title: 'title',
                  label: 'Title',
                  type: 'text',
                  required: true,
                  default: widgetEditor.title,
                  value: widgetEditor.title,
                  placeholder: 'Widget title'
                }}
              >
                {Input}
              </Field>
              <Field
                ref={(c) => { if (c) FORM_ELEMENTS.elements.description = c; }}
                onChange={description => this.setState({ description })}
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
                  className: '-secondary'
                }}
              >
                Save
              </Button>
              <Button
                properties={{
                  disabled: submitting,
                  className: '-primary'
                }}
                onClick={this.handleCancel}
              >
                Cancel
              </Button>
            </div>
          </form>
        }
        {saved &&
        <div>
          <div className="icon-container">
            <img alt="Widget Saved" src="/static/images/components/modal/widget-saved.svg" />
          </div>
          <div className="buttons-widget-saved">
            <Button
              properties={{ className: '-primary' }}
              onClick={this.handleCancel}
            >
              OK
            </Button>
            <Button
              properties={{ className: '-secondary' }}
              onClick={this.handleGoToMyRW}
            >
              Check my widgets
            </Button>
          </div>
        </div>
        }
      </div>
    );
  }
}

SaveWidgetModal.propTypes = {
  dataset: PropTypes.string.isRequired,
  tableName: PropTypes.string.isRequired,
  datasetType: PropTypes.string,
  datasetProvider: PropTypes.string,
  // Store
  user: PropTypes.object.isRequired,
  widgetEditor: PropTypes.object.isRequired,
  toggleModal: PropTypes.func.isRequired,
  setTitle: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  user: state.user,
  widgetEditor: state.widgetEditor
});

const mapDispatchToProps = dispatch => ({
  toggleModal: open => dispatch(toggleModal(open)),
  setTitle: title => dispatch(setTitle(title))
});


export default connect(mapStateToProps, mapDispatchToProps)(SaveWidgetModal);
