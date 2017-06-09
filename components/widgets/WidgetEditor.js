import React from 'react';
import HTML5Backend from 'react-dnd-html5-backend';
import { DragDropContext } from 'react-dnd';
import DatasetService from 'services/DatasetService';
import ColumnBox from 'components/widgets/ColumnBox';
import FilterContainer from 'components/widgets/FilterContainer';
import Select from 'components/form/SelectInput';
import withRedux from 'next-redux-wrapper';
import { initStore } from 'store';

@DragDropContext(HTML5Backend)
class WidgetEditor extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      fields: [],
      // Jiminy
      jiminy: {}
    };

    // DatasetService
    this.datasetService = new DatasetService(props.dataset, {
      apiURL: process.env.WRI_API_URL
    });

    // BINDINGS
  }

  componentDidMount() {
    this.datasetService.getFields()
      .then((response) => {
        this.setState({
          loading: false,
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
          loading: false,
          jiminy
        });
        console.log('jiminy', jiminy);
      })
      .catch((err) => {
        console.error(err);
        this.setState({ loading: false });
      });
  }

  handleChartTypeChange() {

  }

  render() {
    const { fields, jiminy } = this.state;
    return (
      <div className="c-widget-editor">
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
                return (<ColumnBox
                  key={`${i}-columnbox`}
                  name={val.columnName}
                  type={val.columnType}
                />);
              }
            }
            )}
          </div>
          <div >
            <div className="dimensions-box">
              <h5>Dimensions</h5>

            </div>
            <div className="color-box">
              <h5>Color</h5>
            </div>
            <div className="color-box">
              <h5>Size</h5>

            </div>
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
