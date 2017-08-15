import React from 'react';
import PropTypes from 'prop-types';
import { Autobind } from 'es-decorators';

// Redux
import { connect } from 'react-redux';

import { setFilters, setColor, setCategory, setValue, setSize, setOrderBy,
  setAggregateFunction, setLimit, setChartType } from 'redactions/widgetEditor';

// Services
import WidgetService from 'services/WidgetService';
import DatasetsService from 'services/DatasetsService';

// Components
import Spinner from 'components/ui/Spinner';
import WidgetEditor from 'components/widgets/WidgetEditor';
import Button from 'components/ui/Button';
import Input from 'components/form/Input';
import Field from 'components/form/Field';
import Select from 'components/form/SelectInput';

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

class WidgetsNew extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      submitting: false,
      datasets: [],
      selectedDataset: null,
      widget: {}
    };

    // Services
    this.widgetService = new WidgetService(null, { apiURL: process.env.CONTROL_TOWER_URL });
    this.datasetsService = new DatasetsService();
  }

  componentDidMount() {
    this.datasetsService.fetchAllData({}).then((response) => {
      this.setState({
        datasets: response.map(dataset => ({ label: dataset.name, value: dataset.id })),
        loading: false
      });
    });
  }

  @Autobind
  async onSubmit(event) {
    if (event) {
      event.preventDefault();
    }

    this.setState({
      loading: true
    });
    const { widget } = this.state;
    const widgetAtts = widget.attributes;
    const dataset = widgetAtts.dataset;
    const { widgetEditor, tableName, user } = this.props;
    const { limit, value, category, color, size, orderBy, aggregateFunction,
      chartType, filters, areaIntersection } = widgetEditor;

    let chartConfig;
    try {
      chartConfig = await getChartConfig(widgetEditor, tableName, dataset);
    } catch (err) {
      this.setState({
        saved: false,
        error: true,
        errorMessage: 'Unable to generate the configuration of the chart'
      });

      return;
    }

    const widgetConfig = {
      widgetConfig: Object.assign(
        {},
        {
          paramsConfig: {
            limit,
            value,
            category,
            color,
            size,
            orderBy,
            aggregateFunction,
            chartType,
            filters,
            areaIntersection
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
          alert(errorMessage); // eslint-disable-line no-alert
        } else {
          this.setState({
            saved: true,
            loading: false,
            error: false
          });
          alert('Widget updated successfully!'); // eslint-disable-line no-alert
        }
      }).catch((err) => {
        this.setState({
          saved: false,
          error: true
        });
        console.log(err); // eslint-disable-line no-console
      });
  }

  @Autobind
  handleChange(value) {
    const newWidgetAtts = Object.assign({}, this.state.widget.attributes, value);
    const newWidgetObj = Object.assign({}, this.state.widget, { attributes: newWidgetAtts });
    this.setState({ widget: newWidgetObj });
  }

  @Autobind
  handleDatasetSelected(value) {
    this.setState({
      selectedDataset: value
    });
  }

  render() {
    const { loading, widget, submitting, datasets, selectedDataset } = this.state;

    return (
      <div className="c-myrw-widgets-edit">
        <Spinner
          className="-relative -light"
          isLoading={loading}
        />
        <div className="dataset-selector">
          <Field
            onChange={this.handleDatasetSelected}
            className="-fluid"
            options={datasets}
            properties={{
              name: 'dataset',
              label: 'Dataset',
              value: selectedDataset,
              required: true,
              instanceId: 'selectDataset'
            }}
          >
            {Select}
          </Field>
        </div>
        {selectedDataset &&
        <div>
          <WidgetEditor
            widget={widget}
            dataset={selectedDataset}
            availableVisualizations={['chart', 'table']}
            mode="widget"
            onUpdateWidget={this.onSubmit}
            showSaveButton
          />
          <div className="form-container">
            <form className="form-container" onSubmit={this.onSubmit}>
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
                <Field
                  ref={(c) => { if (c) FORM_ELEMENTS.elements.authors = c; }}
                  onChange={value => this.handleChange({ authors: value })}
                  properties={{
                    title: 'authors',
                    label: 'Authors',
                    type: 'text',
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
                    className: '-secondary'
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

WidgetsNew.propTypes = {
  // Store
  user: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  user: state.user,
  widgetEditor: state.widgetEditor
});

export default connect(mapStateToProps, null)(WidgetsNew);
