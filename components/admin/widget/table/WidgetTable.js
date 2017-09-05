import React from 'react';
import PropTypes from 'prop-types';
import sortBy from 'lodash/sortBy';
import { Link } from 'routes';

// Components
import Spinner from 'components/ui/Spinner';
import CustomTable from 'components/ui/customtable/CustomTable';

// Actions
import DeleteAction from 'components/ui/customtable/actions/DeleteAction';

class WidgetTable extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      widgets: [],
      loading: true
    };
  }

  componentDidMount() {
    this.getWidgets();
  }

  /**
   * HELPERS
   * - getWidgets
   * - validate
   * - isValid
  */
  getWidgets() {
    const { application } = this.props;
    const url = [
      process.env.WRI_API_URL,
      // If a dataset is passed, we only display its widgets
      this.props.dataset ? `/dataset/${this.props.dataset}` : '',
      `/widget?application=${application.join(',')}&page[size]=9999`
    ].join('');

    fetch(new Request(url))
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error(response.statusText);
      })
      .then((response) => {
        const widgets = sortBy(response.data.map(widget =>
          Object.assign({}, widget.attributes, {
            id: widget.id
          })
        ), 'name');
        this.setState({ widgets, loading: false });
      })
      .catch(() => {
        this.setState({ message: 'Error loading datasets', loading: false });
      });
  }

  render() {
    const actions = [
      {
        name: 'Edit',
        show: true,
        component: ({ data }) => (
          <Link route="admin_data_detail" params={{ tab: 'widgets', id: data.id, subtab: 'edit' }}><a className="c-btn">Edit</a></Link>
        )
      },
      { name: 'Remove', path: '/admin/datasets/:dataset_id/widgets/:id/remove', show: true, component: DeleteAction, componentProps: { authorization: this.props.authorization } }
    ];

    if (!this.props.dataset) {
      actions.unshift({
        name: 'Go to dataset',
        show: true,
        component: ({ data }) => (
          <Link route="admin_data_detail" params={{ tab: 'datasets', id: data.dataset, subtab: 'edit' }}><a className="c-btn">Go to dataset</a></Link>
        )
      });
    }

    return (
      <div className="c-widget-table">
        <Spinner className="-light" isLoading={this.state.loading} />
        <CustomTable
          columns={[
            { label: 'Name', value: 'name' },
            { label: 'Source', value: 'source' },
            { label: 'Default', value: 'default', td: ({ value, index }) => (<td key={index}>{value ? 'Yes' : 'No'}</td>) }
          ]}
          actions={{
            show: true,
            list: actions
          }}
          filters={false}
          data={this.state.widgets}
          pageSize={20}
          pagination={{
            enabled: true,
            pageSize: 20,
            page: 0
          }}
          sort={{
            field: 'name',
            value: 1
          }}
        />
      </div>
    );
  }
}

WidgetTable.defaultProps = {
  application: [],
  columns: [],
  actions: {}
};

WidgetTable.propTypes = {
  application: PropTypes.array.isRequired,
  authorization: PropTypes.string.isRequired,
  dataset: PropTypes.string
};

export default WidgetTable;
