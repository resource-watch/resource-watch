import React from 'react';
import Jiminy from 'jiminy';

// Components
import Field from 'components/form/Field';
import Select from 'components/form/SelectInput';

const chartConfig = [
  {
    name: 'bar',
    acceptedStatTypes: [
      ['nominal'],
      ['ordinal'],
      ['quantitative', 'nominal'],
      ['quantitative', 'temporal'],
      ['quantitative', 'ordinal']
    ]
  },
  {
    name: 'line',
    acceptedStatTypes: [
      ['quantitative', 'temporal'],
      ['quantitative', 'ordinal']
    ]
  },
  {
    name: 'pie',
    acceptedStatTypes: [
      ['nominal'],
      ['ordinal']
    ]
  }
];

const chartFields = [
  {
    name: 'bar',
    fields: [
      {
        name: 'xAxis',
        label: 'X axis',
        onChange(val) {
          this.setState(
            { selected: Object.assign(this.state.selected,
              {
                xAxis: val,
                lastAxisSelected: 'xAxis'
              })
            },
            this.getRecommendationForOtherAxis);
        }
      },
      {
        name: 'yAxis',
        label: 'Y axis',
        onChange(val) {
          this.setState(
            { selected: Object.assign(this.state.selected,
              {
                yAxis: val,
                lastAxisSelected: 'yAxis'
              })
            },
            this.getRecommendationForOtherAxis);
        }
      }
    ]
  },
  {
    name: 'line',
    fields: [
      {
        name: 'xAxis',
        label: 'X axis',
        onChange(val) {
          this.setState(
            { selected: Object.assign(this.state.selected,
              {
                xAxis: val,
                lastAxisSelected: 'xAxis'
              })
            },
            this.getRecommendationForOtherAxis);
        }
      },
      {
        name: 'yAxis',
        label: 'Y axis',
        onChange(val) {
          this.setState(
            { selected: Object.assign(this.state.selected,
              {
                yAxis: val,
                lastAxisSelected: 'yAxis'
              })
            },
            this.getRecommendationForOtherAxis);
        }
      }
    ]
  },
  {
    name: 'pie',
    fields: [
      {
        name: 'xAxis',
        label: 'Data source',
        columns: [],
        onChange(val) {
          this.setState(
            { selected: Object.assign(this.state.selected, { xAxis: val }) },
            this.triggerSelectionChange);
        }
      }
    ]
  }
];

class WidgetConfigurator extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      chartTypeOptions: [], // Chart types available
      allColumns: [],
      xAxisOptions: [],
      yAxisOptions: [],
      selected: {
        chartType: '',
        xAxis: '',
        yAxis: '',
        lastAxisSelected: ''
      }
    };

    this.jiminy = new Jiminy(this.props.dataset, chartConfig);

    // BINDINGS
  }

  componentWillMount() {
    if (this.props.dataset.length) {
      this.getChartTypeOptions();
    }
  }

  onChartTypeChanged(value) {
    // Retrieve fields description from JSON object
    const chartFieldsSelected = chartFields.find(elem => elem.name === value);
    const allColumnsArray = this.jiminy.columns(chartFieldsSelected.name);
    this.setState({
      selected: {
        chartType: value
      },
      allColumns: allColumnsArray,
      xAxisOptions: allColumnsArray,
      yAxisOptions: allColumnsArray
    });
  }

  getChartTypeOptions() {
    this.setState({
      chartTypeOptions: this.jiminy.recommendation()
    });
  }

  triggerSelectionChange() {
    console.info('triggerSelectionChange', this.state);
    const { selected } = this.state;
    const columns = [];

    if (selected.xAxis) columns.push({ key: 'x', value: selected.xAxis });
    if (selected.yAxis) columns.push({ key: 'y', value: selected.yAxis });

    this.props.onSelectionChange(columns, selected.chartType);
  }

  getRecommendationForOtherAxis() {
    const { selected } = this.state;
    if (selected.lastAxisSelected === 'xAxis') {
      this.setState({
        yAxisOptions: this.jiminy.columns(selected.chartType, selected.xAxis)
      });
    } else if (selected.lastAxisSelected === 'yAxis') {
      this.setState({
        xAxisOptions: this.jiminy.columns(selected.chartType, selected.yAxis)
      });
    }

    if (selected.chartType === 'pie' && !!selected.xAxis &&
        selected.xAxis.length > 0) {
      this.triggerSelectionChange();
    } else if (selected.chartType === 'bar' && !!selected.xAxis
        && selected.xAxis.length > 0 && !!selected.yAxis &&
        selected.yAxis.length > 0) {
      this.triggerSelectionChange();
    }
  }

  getFieldOptions(el) {
    return this.state[`${el.name}Options`].map(option => ({ label: option, value: option }));
  }

  render() {
    const { chartTypeOptions } = this.state;
    const selected = this.state.selected;
    const { chartType } = selected;

    const chartTypeOptionsValue = chartTypeOptions.length ?
      chartTypeOptions.map(value => ({ label: value, value }))
      : [{ label: 'Loading', value: 'Loading' }];

    return (
      <div className="c-widget-configurator">
        <Field
          onChange={value => this.onChartTypeChanged(value)}
          options={chartTypeOptionsValue}
          properties={{
            multi: false,
            type: 'text',
            default: '',
            label: 'CHART TYPE'
          }}
        >
          {Select}
        </Field>
        {(chartType !== '') &&
          <div>
            {
              chartFields.find(elem => elem.name === chartType).fields.map(el =>
                <Field
                  onChange={val => el.onChange.call(this, val)}
                  options={this.getFieldOptions(el)}
                  properties={{
                    multi: false,
                    type: 'text',
                    label: el.label,
                    value: selected[el.name]
                  }}
                >
                  {Select}
                </Field>
              )
            }
          </div>
        }
      </div>
    );
  }
}

WidgetConfigurator.propTypes = {
  dataset: React.PropTypes.array.isRequired,
  // functions
  onSelectionChange: React.PropTypes.func.isRequired
};

export default WidgetConfigurator;
