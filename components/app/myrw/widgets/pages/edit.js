import React from 'react';
import PropTypes from 'prop-types';
import { Autobind } from 'es-decorators';
import { toastr } from 'react-redux-toastr';

// Redux
import { connect } from 'react-redux';

import {
  setFilters,
  setColor,
  setCategory,
  setValue,
  setSize,
  setOrderBy,
  setAggregateFunction,
  setLimit,
  setChartType,
  setBand,
  setVisualizationType,
  setLayer
} from 'redactions/widgetEditor';

// Services
import WidgetService from 'services/WidgetService';
import DatasetService from 'services/DatasetService';
import LayersService from 'services/LayersService';

// Components
import Spinner from 'components/ui/Spinner';
import WidgetEditor from 'components/widgets/WidgetEditor';
import Button from 'components/ui/Button';
import Input from 'components/form/Input';
import Field from 'components/form/Field';

// utils
import { getChartConfig, getChartInfo } from 'utils/widgets/WidgetHelper';

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
      { apiURL: process.env.CONTROL_TOWER_URL });
  }

  componentWillMount() {
    this.widgetService.fetchData()
      .then((data) => {
        this.setState({ widget: data }, () => {
          this.loadWidgetIntoRedux();
        });
        return data.attributes.dataset;
      })
      .then((datasetId) => {
        const datasetService = new DatasetService(datasetId, { apiURL: process.env.WRI_API_URL });
        return datasetService.fetchData()
          .then(dataset => this.setState({ dataset }));
      })
      // TODO: handle the error in the UI
      .catch(err => console.error(err))
      .then(() => this.setState({ loading: false }));
  }

  @Autobind
  async onSubmit(event) {
    if (event) event.preventDefault();

    this.setState({ loading: true });

    const { widget } = this.state;
    const widgetAtts = widget.attributes;
    const dataset = widgetAtts.dataset;
    const { widgetEditor, user } = this.props;
    const {
      visualizationType,
      band,
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
      layer
    } = widgetEditor;
    const { type, provider, tableName } = this.state.dataset.attributes;


    let chartConfig;

    // If the visualization if a map, we don't have any chartConfig
    if (visualizationType !== 'map') {
      const chartInfo = getChartInfo(dataset, type, provider, widgetEditor);

      try {
        chartConfig = await getChartConfig(
          dataset,
          type,
          tableName,
          band,
          provider,
          chartInfo
        );
      } catch (err) {
        this.setState({
          saved: false,
          error: true,
          loading: false,
          errorMessage: 'Unable to generate the configuration of the chart'
        });

        return;
      }
    }

    const widgetConfig = {
      widgetConfig: Object.assign(
        {},
        {
          paramsConfig: {
            visualizationType,
            band,
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
            layer: layer && layer.id
          }
        },
        chartConfig
      )
    };

    const widgetObj = Object.assign(
      {},
      {
        id: widget.id,
        application: widgetAtts.application,
        name: widgetAtts.name,
        description: widgetAtts.description,
        authors: widgetAtts.authors,
        source: widgetAtts.source,
        sourceUrl: widgetAtts.sourceUrl
      },
      widgetConfig
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
  @Autobind
  onUpdateWidget() {
    // We can't directly call this.onSubmit otherwise the form won't be
    // validated. We can't execute this.form.submit either because the
    // validation is not always triggered (see MDN). One solution is as
    // following: simulating a click on the submit button to trigger the
    // validation and eventually save the changes
    if (this.form) this.form.querySelector('button[type="submit"]').click();
  }

  loadWidgetIntoRedux() {
    const { paramsConfig } = this.state.widget.attributes.widgetConfig;
    const {
      visualizationType,
      band,
      value,
      category,
      color,
      size,
      aggregateFunction,
      orderBy,
      filters,
      limit,
      chartType,
      layer
    } = paramsConfig;

    // We restore the type of visualization
    // We default to "chart" to maintain the compatibility with previously created
    // widgets (at that time, only "chart" widgets could be created)
    this.props.setVisualizationType(visualizationType || 'chart');

    if (band) this.props.setBand(band);
    if (layer) this.props.setLayer(layer);
    if (aggregateFunction) this.props.setAggregateFunction(aggregateFunction);
    if (value) this.props.setValue(value);
    if (size) this.props.setSize(size);
    if (color) this.props.setColor(color);
    if (orderBy) this.props.setOrderBy(orderBy);
    if (category) this.props.setCategory(category);
    if (filters) this.props.setFilters(filters);
    if (limit) this.props.setLimit(limit);
    if (chartType) this.props.setChartType(chartType);
  }

  @Autobind
  handleChange(value) {
    const newWidgetAtts = Object.assign({}, this.state.widget.attributes, value);
    const newWidgetObj = Object.assign({}, this.state.widget, { attributes: newWidgetAtts });
    this.setState({ widget: newWidgetObj });
  }

  render() {
    const { loading, widget, submitting } = this.state;
    const widgetAtts = widget && widget.attributes;

    return (
      <div className="c-myrw-widgets-edit">
        <Spinner
          className="-relative -light"
          isLoading={loading}
        />
        {widget &&
        <div>
          <WidgetEditor
            widget={widget}
            dataset={widget.attributes.dataset}
            mode="widget"
            onUpdateWidget={this.onUpdateWidget}
            showSaveButton
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
                <Field
                  ref={(c) => { if (c) FORM_ELEMENTS.elements.authors = c; }}
                  onChange={value => this.handleChange({ authors: value })}
                  properties={{
                    title: 'authors',
                    label: 'Authors',
                    type: 'text',
                    default: widgetAtts.authors,
                    placeholder: 'Author name'
                  }}
                >
                  {Input}
                </Field>
                <div className="source-container">
                  <Field
                    ref={(c) => { if (c) FORM_ELEMENTS.elements.source = c; }}
                    onChange={value => this.handleChange({ source: value })}
                    properties={{
                      title: 'source',
                      label: 'Source name',
                      type: 'text',
                      default: widgetAtts.source,
                      placeholder: 'Source name'
                    }}
                  >
                    {Input}
                  </Field>
                  <Field
                    ref={(c) => { if (c) FORM_ELEMENTS.elements.sourceUrl = c; }}
                    onChange={value => this.handleChange({ sourceUrl: value })}
                    properties={{
                      title: 'sourceUrl',
                      label: 'Source URL',
                      type: 'text',
                      default: widgetAtts.sourceUrl,
                      placeholder: 'Paste a URL here'
                    }}
                  >
                    {Input}
                  </Field>
                </div>
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
  // ACTIONS
  setFilters: PropTypes.func.isRequired,
  setSize: PropTypes.func.isRequired,
  setColor: PropTypes.func.isRequired,
  setCategory: PropTypes.func.isRequired,
  setValue: PropTypes.func.isRequired,
  setOrderBy: PropTypes.func.isRequired,
  setAggregateFunction: PropTypes.func.isRequired,
  setLimit: PropTypes.func.isRequired,
  setChartType: PropTypes.func.isRequired,
  setVisualizationType: PropTypes.func.isRequired,
  setBand: PropTypes.func.isRequired,
  setLayer: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  user: state.user,
  widgetEditor: state.widgetEditor
});

const mapDispatchToProps = dispatch => ({
  setFilters: filter => dispatch(setFilters(filter)),
  setColor: color => dispatch(setColor(color)),
  setSize: size => dispatch(setSize(size)),
  setCategory: category => dispatch(setCategory(category)),
  setValue: value => dispatch(setValue(value)),
  setOrderBy: value => dispatch(setOrderBy(value)),
  setAggregateFunction: value => dispatch(setAggregateFunction(value)),
  setLimit: value => dispatch(setLimit(value)),
  setChartType: value => dispatch(setChartType(value)),
  setVisualizationType: vis => dispatch(setVisualizationType(vis)),
  setBand: band => dispatch(setBand(band)),
  setLayer: (layerId) => {
    new LayersService()
      .fetchData({ id: layerId })
      .then(layer => dispatch(setLayer(layer)))
      // TODO: better handling of the error
      .catch(err => console.error(err));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(WidgetsEdit);
