import React from 'react';
import sortBy from 'lodash/sortBy';
import Spinner from '../ui/Spinner';

class DatasetList extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      datasets: [],
      loading: true
    };
  }

  componentDidMount() {
    this.getDatasets();
  }

  /**
   * HELPERS
   * - getDatasets
  */
  getDatasets() {
    const { application } = this.props;
    const url = `${process.env.WRI_API_URL}/dataset?application=${application.join(',')}&includes=widget,layer&page[size]=${Date.now() / 100000}`;

    fetch(new Request(url))
      .then((response) => {
        if (response.ok) return response.json();
        throw new Error(response.statusText);
      })
      .then((response) => {
        const datasets = sortBy(response.data.map(dataset =>
          Object.assign({}, dataset.attributes, {
            id: dataset.id
          })
        ), 'name');
        this.setState({ datasets, loading: false });
      })
      .catch(() => {
        this.setState({ message: 'Error loading datasets', loading: false });
      });
  }

  render() {
    const { mode } = this.props;
    const datasets = (
      <ul className="list">
        {this.state.datasets.map(dataset => (<li key={dataset.id} className="list-item">{dataset.name}</li>))}
      </ul>
    );

    return (
      <div className={`c-datasets-list -${mode}`}>
        <Spinner className="-light" isLoading={this.state.loading} />
        { datasets }
      </div>
    );
  }
}

DatasetList.defaultProps = {
  application: ['rw'],
  selectable: false,
  editable: true,
  editPath: '/admin/datasets/:id/edit'
};

DatasetList.propTypes = {
  application: React.PropTypes.array.isRequired,
  selectable: React.PropTypes.bool,
  editable: React.PropTypes.bool,
  editPath: React.PropTypes.string,
  selected: React.PropTypes.object, // deprecated
  onChange: React.PropTypes.func // deprecated
};

export default DatasetList;
