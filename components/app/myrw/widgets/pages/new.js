import React from 'react';
import PropTypes from 'prop-types';
import { Autobind } from 'es-decorators';

// Redux
import { connect } from 'react-redux';

import { setFilters, setColor, setCategory, setValue, setSize, setOrderBy,
  setAggregateFunction, setLimit, setChartType } from 'redactions/widgetEditor';

// Services
import WidgetService from 'services/WidgetService';

// Components
import Spinner from 'components/ui/Spinner';
import WidgetEditor from 'components/widgets/WidgetEditor';
import Button from 'components/ui/Button';
import Input from 'components/form/Input';
import Field from 'components/form/Field';

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
      widget: null
    };

    // Services
    this.widgetService = new WidgetService(this.props.id,
      { apiURL: process.env.CONTROL_TOWER_URL });
  }

  componentWillMount() {
    this.widgetService.fetchData().then((data) => {
      this.setState({
        widget: data,
        loading: false
      }, () => {
        this.loadWidgetIntoRedux();
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

  loadWidgetIntoRedux() {
    const { paramsConfig } = this.state.widget.attributes.widgetConfig;
    const {
        value,
        category,
        color,
        size,
        aggregateFunction,
        orderBy,
        filters,
        limit,
        chartType
      } = paramsConfig;

    if (aggregateFunction) {
      this.props.setAggregateFunction(aggregateFunction);
    }
    if (value) {
      this.props.setValue(value);
    }
    if (size) {
      this.props.setSize(size);
    }
    if (color) {
      this.props.setColor(color);
    }
    if (orderBy) {
      this.props.setOrderBy(orderBy);
    }
    if (category) {
      this.props.setCategory(category);
    }
    if (filters) {
      this.props.setFilters(filters);
    }
    if (limit) {
      this.props.setLimit(limit);
    }
    if (chartType) {
      this.props.setChartType(chartType);
    }
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
  setChartType: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  user: state.user,
  widgetEditor: state.widgetEditor
});

const mapDispatchToProps = dispatch => ({
  setFilters: (filter) => {
    dispatch(setFilters(filter));
  },
  setColor: (color) => {
    dispatch(setColor(color));
  },
  setSize: (size) => {
    dispatch(setSize(size));
  },
  setCategory: (category) => {
    dispatch(setCategory(category));
  },
  setValue: (value) => {
    dispatch(setValue(value));
  },
  setOrderBy: (value) => {
    dispatch(setOrderBy(value));
  },
  setAggregateFunction: (value) => {
    dispatch(setAggregateFunction(value));
  },
  setLimit: (value) => {
    dispatch(setLimit(value));
  },
  setChartType: (value) => {
    dispatch(setChartType(value));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(WidgetsNew);
