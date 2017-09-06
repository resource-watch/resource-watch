import React from 'react';
import PropTypes from 'prop-types';
import Jiminy from 'jiminy';
import { toastr } from 'react-redux-toastr';

// Components
import Field from 'components/form/Field';
import Select from 'components/form/SelectInput';
import Spinner from 'components/ui/Spinner';
import VegaChart from 'components/admin/widget/VegaChart';

// Utils
import getQueryByFilters from 'utils/getQueryByFilters';
import getParsedConfig from 'utils/getWidgetConfig';

// Services
import DatasetService from 'services/DatasetService';

import { chartConfig } from './constants';

class WidgetPreview extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,

      // Options
      chartOptions: [],
      xOptions: [],
      yOptions: [],

      // Config
      parsedConfig: {},

      // Selected
      selected: {
        type: '',
        xAxis: '',
        yAxis: '',
        chartConfig: {}
      }
    };

    // DatasetService
    this.datasetService = new DatasetService(props.wizard.dataset.id, {
      apiURL: `${process.env.WRI_API_URL}`
    });

    // BINDINGS
    this.triggerChangeSelected = this.triggerChangeSelected.bind(this);
  }

  componentDidMount() {
    this.datasetService.fetchFilteredData(this.props.wizard.query)
      .then((data) => {
        this.setState({
          loading: false,
          data
        }, () => {
          this.getChartOptions();
        });
      })
      .catch((err) => {
        toastr.error('Error', err);
        this.setState({ loading: false });
      });
  }


  /**
   * HELPERS
   * - getChartOptions
   * - getChartData
   * - getAxisOptions
  */
  getChartOptions() {
    /* Finally, you instantiate Jiminy with both the objects */
    this.jiminy = new Jiminy(this.state.data, chartConfig);

    /* You can get recommendations: what chartOptions you can build with the data: */
    this.setState({
      chartOptions: this.jiminy.recommendation(this.state.selected.columns)
    });
  }

  getChartData() {
    const { selected } = this.state;
    const { wizard } = this.props;
    const columns = [];

    if (selected.xAxis) columns.push({ key: 'x', value: selected.xAxis });
    if (selected.yAxis) columns.push({ key: 'y', value: selected.yAxis });

    const sql = getQueryByFilters(wizard.dataset.tableName, wizard.filters, columns);

    const parsedConfig = {
      data: [{
        url: `${process.env.WRI_API_URL}/query/${wizard.dataset.id}?sql=${sql}`,
        name: 'table',
        format: {
          type: 'json',
          property: 'data'
        }
      }]
    };

    this.setState({ parsedConfig });
  }

  getAxisOptions() {
    const { selected } = this.state;
    this.setState({
      xOptions: (selected.type) ? this.jiminy.columns(selected.type, selected.yAxis) : [],
      yOptions: (selected.type) ? this.jiminy.columns(selected.type, selected.xAxis) : []
    }, () => {
      this.getChartData();
    });
  }

  /**
   * UI EVENTS
   * - triggerChangeSelected
  */
  triggerChangeSelected(obj) {
    // If type doesn't exist let's clear the selects
    const objParsed = (Object.prototype.hasOwnProperty.call(obj, 'type')) ?
      Object.assign({}, obj, { xAxis: null, yAxis: null }) :
      obj;
    const selected = Object.assign({}, this.state.selected, objParsed);
    this.setState({ selected }, () => {
      this.getAxisOptions();
    });
  }


  render() {
    const { selected, loading, chartOptions, xOptions, yOptions, parsedConfig } = this.state;
    return (
      <div className="c-widgets-preview">

        <Spinner className="-light" isLoading={loading} />

        <fieldset className="c-field-container">
          {!!chartOptions.length &&
            <Field
              options={chartOptions.map(graphType =>
                ({ label: graphType, value: graphType })
              )}
              properties={{
                name: 'type',
                label: 'Chart type',
                default: '',
                value: selected.type
              }}
              onChange={value => this.triggerChangeSelected({ type: value })}
            >
              {Select}
            </Field>
          }

          {!!xOptions.length &&
            <Field
              options={xOptions.map(xOption =>
                ({ label: xOption, value: xOption })
              )}
              properties={{
                name: 'xAxis',
                label: 'X axis',
                default: '',
                value: selected.xAxis
              }}
              onChange={value => this.triggerChangeSelected({ xAxis: value })}
            >
              {Select}
            </Field>
          }

          {!!yOptions.length &&
            <Field
              options={yOptions.map(yOption =>
                ({ label: yOption, value: yOption })
              )}
              properties={{
                name: 'yAxis',
                label: 'Y axis',
                default: '',
                value: selected.yAxis
              }}
              onChange={value => this.triggerChangeSelected({ yAxis: value })}
            >
              {Select}
            </Field>
          }

          {selected.type &&
            <VegaChart
              data={getParsedConfig(selected.type, parsedConfig)}
            />
          }
        </fieldset>
      </div>
    );
  }
}

WidgetPreview.propTypes = {
  wizard: PropTypes.object.isRequired
};

export default WidgetPreview;
