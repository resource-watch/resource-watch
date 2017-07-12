import React from 'react';
import PropTypes from 'prop-types';

// Redux
import withRedux from 'next-redux-wrapper';
import { initStore } from 'store';

// Components
import Spinner from 'components/ui/Spinner';

// Services
import DatasetService from 'services/DatasetService';

// Utils
import getQueryByFilters from 'utils/getQueryByFilters';

class TableView extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      data: null
    };

    // DatasetService
    this.datasetService = new DatasetService(props.dataset, {
      apiURL: process.env.WRI_API_URL
    });
  }

  componentWillMount() {
    this.getDataForTable(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.getDataForTable(nextProps);
  }

  getDataForTable(props) {
    const { tableName, widgetEditor } = props;
    const { filters, fields, value, aggregateFunction, category, orderBy, limit } = widgetEditor;
    const aggregateFunctionExists = aggregateFunction && aggregateFunction !== 'none';

    const arrColumns = fields.filter(val => val.columnName !== 'cartodb_id' && val.columnType !== 'geometry').map(
      (val) => {
        if (value && value.name === val.columnName && aggregateFunctionExists) {
          // Value
          return { value: val.columnName, key: val.columnName, aggregateFunction, group: false };
        } else if (category && category.name === val.columnName && aggregateFunctionExists) {
          // Category
          return { value: val.columnName, key: val.columnName, group: true };
        } else {
          // Rest of columns
          return {
            value: val.columnName,
            key: val.columnName,
            remove: aggregateFunctionExists
          };
        }
      }
    ).filter(val => !val.remove);

    const orderByColumn = orderBy ? [orderBy] : [];
    if (orderByColumn.length > 0 && value && orderByColumn[0].name === value.name && aggregateFunction && aggregateFunction !== 'none') {
      orderByColumn[0].name = `${aggregateFunction}(${value.name})`;
    }

    const sortOrder = orderBy ? orderBy.orderType : 'asc';
    const query = `${getQueryByFilters(tableName, filters, arrColumns, orderByColumn, sortOrder)} LIMIT ${limit}`;

    this.setState({ loading: true });
    this.datasetService.fetchFilteredData(query).then((response) => {
      this.setState({
        data: response,
        loading: false
      });
    }).catch(err => console.log(err));
  }

  render() {
    const { loading, data } = this.state;
    const header = data && data.length > 0 && Object.keys(data[0]);
    return (
      <div className="c-table-view">
        <Spinner
          isLoading={loading}
          className="-ligth"
        />
        <table>
          <thead>
            <tr>
              {header && header.map(val => (
                <th
                  key={`header_${val}`}
                >
                  {val}
                </th>
              ))
              }
            </tr>
          </thead>
          <tbody>
            {data &&
              data.map((row, i) =>
                (
                  <tr
                    key={`row${i}`}
                  >
                    {
                      Object.keys(row).map(column => (<td key={`td${column}`}>{row[column]}</td>))
                    }
                  </tr>
                )
              )
            }
          </tbody>
        </table>
      </div>
    );
  }
}

TableView.propTypes = {
  dataset: PropTypes.string.isRequired,
  tableName: PropTypes.string.isRequired,
  // Store
  widgetEditor: PropTypes.object.isRequired
};

const mapStateToProps = ({ widgetEditor }) => ({ widgetEditor });

export default withRedux(initStore, mapStateToProps, null)(TableView);
