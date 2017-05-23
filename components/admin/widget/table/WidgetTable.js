import React from 'react';
import sortBy from 'lodash/sortBy';
import Spinner from '../../ui/Spinner';
import CustomTable from '../../ui/customtable/CustomTable';
// Actions
import EditAction from './actions/EditAction';
import DeleteAction from './actions/DeleteAction';

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
    const url = `https://api.resourcewatch.org/v1/dataset/${this.props.dataset}/widget?application=${application.join(',')}&page[size]=${Date.now() / 100000}`;

    fetch(new Request(url))
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw new Error(response.statusText);
      })
      .then(response => {
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
    return (
      <div className="c-widget-table">
        <Spinner className="-light" isLoading={this.state.loading} />
        <CustomTable
          columns={[
            { label: 'name', value: 'name' },
            { label: 'status', value: 'status' },
            { label: 'default', value: 'default' }
          ]}
          actions={{
            show: true,
            list: [
              { name: 'Edit', path: '/admin/datasets/:dataset_id/widgets/:id/edit', show: true, component: EditAction },
              { name: 'Remove', path: '/admin/datasets/:dataset_id/widgets/:id/remove', show: true, component: DeleteAction, componentProps: { authorization: this.props.authorization } }
            ]
          }}
          data={this.state.widgets}
          pageSize={20}
          pagination={{
            enabled: true,
            pageSize: 20,
            page: 0
          }}
          onToggleSelectedRow={ids => {
            console.info(ids);
          }}
          onRowDelete={id => {
            console.info(id);
          }}
        />
      </div>
    );
  }
}

WidgetTable.defaultProps = {
  application: ['rw'],
  columns: [],
  actions: {}
};

WidgetTable.propTypes = {
  application: React.PropTypes.array.isRequired,
  dataset: React.PropTypes.string.isRequired,
  authorization: React.PropTypes.string.isRequired
};

export default WidgetTable;
