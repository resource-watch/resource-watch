import React from 'react';
import HTML5Backend from 'react-dnd-html5-backend';
import { Autobind } from 'es-decorators';
import { DragDropContext } from 'react-dnd';
import DatasetService from 'services/DatasetService';
import ColumnBox from 'components/widgets/ColumnBox';
import FilterContainer from 'components/widgets/FilterContainer';
import ColorContainer from 'components/widgets/ColorContainer';
import SizeContainer from 'components/widgets/SizeContainer';
import DimensionXContainer from 'components/widgets/DimensionXContainer';
import DimensionYContainer from 'components/widgets/DimensionYContainer';
import Select from 'components/form/SelectInput';
import Spinner from 'components/ui/Spinner'
import withRedux from 'next-redux-wrapper';
import { initStore } from 'store';

const oneDimensionalChartTypes = ['pie', '1d_scatter', '1d_tick'];

@DragDropContext(HTML5Backend)
class WidgetEditor extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      selectedChartType: null,
      loading: true,
      fieldsLoaded: false,
      jiminyLoaded: false,
      fields: [],
      // Jiminy
      jiminy: {}
    };

    // DatasetService
    this.datasetService = new DatasetService(props.dataset, {
      apiURL: process.env.WRI_API_URL
    });
  }

  componentDidMount() {
    this.datasetService.getFields()
      .then((response) => {
        this.setState({
          loading: !this.state.jiminyLoaded,
          fieldsLoaded: true,
          fields: response
        }, () => {
          this.getJiminy();
        });
      })
      .catch((error) => {
        console.log('error', error);
      });
  }

  getJiminy() {
    const fieldsSt = this.state.fields.fields.map((elem) => {
      if (elem.columnType !== 'geometry') {
        return elem.columnName;
      }
    });
    const querySt = `SELECT ${fieldsSt} FROM ${this.props.dataset} LIMIT 100`;
    this.datasetService.fetchJiminy(querySt)
      .then((jiminy) => {
        this.setState({
          loading: !this.state.fieldsLoaded,
          jiminyLoaded: true,
          jiminy
        });
      })
      .catch((err) => {
        console.error(err);
        this.setState({ loading: false });
      });
  }

  @Autobind
  handleChartTypeChange(val) {
    this.setState({
      selectedChartType: val
    })
  }

  render() {
    const { fields, jiminy, selectedChartType, loading } = this.state;
    const bidimensionalChart = !oneDimensionalChartTypes.includes(selectedChartType);
    return (
      <div className="c-widget-editor">
        <Spinner
          className="-light"
          isLoading={loading}
        />
        <h2>Customize Visualization</h2>
        <div className="chart-type">
          <h5>Chart</h5>
          {
              jiminy && jiminy.general &&
              <Select
                properties={{
                  className: 'chart-type-selector'
                }}
                options={jiminy.general.map(val => (
                  {
                    label: val,
                    value: val
                  }
                ))}
                name="chart-type"
                onChange={this.handleChartTypeChange}

              />
          }
        </div>
        <div className="actions-div">
          <div className="fields">
            <h5>Columns</h5>
            {fields && fields.fields && fields.fields.map((val, i) => {
              if (val.columnType !== 'geometry') {
                return (
                  <ColumnBox
                    key={`${i}-columnbox`}
                    name={val.columnName}
                    type={val.columnType}
                  />
                );
              }
            }
            )}
          </div>
          <div className="customization-container">
            <div className="dimensions-box">
              <h5>Dimensions</h5>
              <DimensionXContainer />
              { bidimensionalChart &&
                <DimensionYContainer />
              }
            </div>
            <ColorContainer />
            <SizeContainer />
            <FilterContainer />
          </div>
        </div>
      </div>
    );
  }
}

WidgetEditor.propTypes = {
  dataset: React.PropTypes.string
};

export default WidgetEditor;
