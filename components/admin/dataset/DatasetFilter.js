import React from 'react';

import DatasetService from '../../services/DatasetService';
import getQueryByFilters from '../../utils/getQueryByFilters';
import DatasetFilterItem from './DatasetFilterItem';
import Spinner from '../ui/Spinner';
import Button from '../ui/Button';

class DatasetFilter extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      columns: [],
      filters: [{}], // We need to create an empty object to render the first one
      query: getQueryByFilters(props.dataset.tableName)
    };

    // DatasetService
    this.datasetService = new DatasetService(props.dataset.id, {
      apiURL: 'https://api.resourcewatch.org/v1'
    });

    // BINDINGS
    this.triggerChangeFilters = this.triggerChangeFilters.bind(this);
    this.triggerNewFilter = this.triggerNewFilter.bind(this);
    this.triggerDeleteFilters = this.triggerDeleteFilters.bind(this);
    this.triggerFetchFilteredData = this.triggerFetchFilteredData.bind(this);
  }

  componentWillMount() {
    this.datasetService.getFilters()
      .then((data) => {
        this.setState({
          loading: false,
          columns: data
        }, () => {
          if (this.props.onChange) {
            this.props.onChange({
              query: this.state.query,
              columns: this.state.columns
            });
          }
        });
      })
      .catch((err) => {
        console.error(err);
        this.setState({ loading: false });
      });
  }

  /**
   * UI EVENTS
   * - triggerChangeFilters
   * - triggerNewFilter
   * - triggerDeleteFilters
   * - triggerFetchFilteredData
  */
  triggerChangeFilters(obj, i) {
    const filters = [].concat(this.state.filters);
    filters[i] = obj;
    const query = getQueryByFilters(this.props.dataset.tableName, filters);

    this.setState({ filters, query }, () => {
      if (this.props.onChange) {
        this.props.onChange({
          query: this.state.query,
          filters: this.state.filters
        });
      }
    });
  }

  triggerNewFilter() {
    const filters = [].concat(this.state.filters);
    filters.push({});
    const query = getQueryByFilters(this.props.dataset.tableName, filters);

    this.setState({ filters, query }, () => {
      if (this.props.onChange) {
        this.props.onChange({
          query: this.state.query,
          filters: this.state.filters
        });
      }
    });
  }

  triggerDeleteFilters(index) {
    const filters = [].concat(this.state.filters);
    filters.splice(index, 1);
    const query = getQueryByFilters(this.props.dataset.tableName, filters);

    this.setState({ filters, query }, () => {
      if (this.props.onChange) {
        this.props.onChange({
          query: this.state.query,
          filters: this.state.filters
        });
      }
    });
  }

  triggerFetchFilteredData() {
    this.datasetService.fetchFilteredData(this.state.query)
      .then((data) => {
        console.info(data);
      })
      .catch((err) => {
        console.error(err);
      });
  }

  /**
   * HELPERS
   * - getColumns
  */
  getColumns(index) {
    const { columns, filters } = this.state;
    let parsedFilters = [].concat(filters);
    let parsedColumns = [].concat(columns);

    if (filters.length > 1 && index) {
      parsedFilters = parsedFilters
        .slice(null, index)
        .map(filter => filter.filters.columnName);
      parsedColumns = parsedColumns.filter((column) => {
        const isColumnFiltered = parsedFilters.indexOf(column.columnName) === -1;
        return isColumnFiltered;
      });
    }

    return parsedColumns;
  }


  /**
   * RENDER
  */
  render() {
    const { columns, filters, query, loading } = this.state;

    return (
      <div className="c-datasets-filter">
        {loading &&
          <Spinner isLoading={loading} className="-light" />
        }
        <div className="list">
          {!!columns.length &&
            filters.map((filter, i) =>
              (<DatasetFilterItem
                key={i}
                index={i}
                columns={this.getColumns(i)}
                filters={filter.filters}
                selected={filter.selected}
                onChange={value => this.triggerChangeFilters(value, i)}
                onDelete={() => this.triggerDeleteFilters(i)}
              />)
            )
          }
        </div>
        <ul className="c-field-buttons actions">
          <li>
            <Button
              properties={{
                type: 'button',
                className: '-primary'
              }}
              onClick={this.triggerNewFilter}
            >
              Add new
            </Button>
          </li>
          <li>
            <Button
              properties={{
                type: 'button',
                className: '-primary'
              }}
              onClick={this.triggerFetchFilteredData}
            >
              Preview
            </Button>
          </li>
        </ul>
        <div className="actions">
          <pre><code className="language-sql">{query}</code></pre>
        </div>
      </div>
    );
  }
}

DatasetFilter.propTypes = {
  dataset: React.PropTypes.object.isRequired,
  onChange: React.PropTypes.func
};

export default DatasetFilter;
