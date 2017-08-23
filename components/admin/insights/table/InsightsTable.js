import React from 'react';
import Spinner from 'components/ui/Spinner';
import CustomTable from 'components/ui/customtable/CustomTable';
import DeleteAction from 'components/ui/customtable/actions/DeleteAction';
import EditAction from 'components/ui/customtable/actions/EditAction';
import { get } from 'utils/request';

class InsightsTable extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      insights: [],
      loading: true
    };
  }

  componentDidMount() {
    this.getInsights();
  }

  /**
   * HELPERS
   * - getInsights
  */
  getInsights() {
    get(
      {
        url: `${process.env.API_URL}/insights`,
        headers: [
          { key: 'Content-Type', value: 'application/json' },
          { key: 'Authorization', value: this.props.authorization }
        ],
        onSuccess: (response) => {
          console.log('success!');
          console.log(response);
          const insights = response.data.map(insight =>
            Object.assign({}, insight.attributes, {
              id: insight.id
            })
          );
          this.setState({ insights, loading: false });
        },
        onError: (error) => {
          this.setState({ message: `Error loading insights: ${error}`, loading: false });
        }
      }
    );
  }

  render() {
    return (
      <div className="c-insights-table">
        <Spinner className="-light" isLoading={this.state.loading} />
        <CustomTable
          columns={[
            { label: 'name', value: 'name' },
            { label: 'featured', value: 'featured' },
            { label: 'published', value: 'published' }
          ]}
          actions={{
            show: true,
            list: [
              { name: 'Edit', path: '/admin/insights/:id/edit', show: true, component: EditAction },
              { name: 'Remove', path: '/admin/insights/:id/remove', show: true, component: DeleteAction }
            ]
          }}
          data={this.state.insights}
          pageSize={20}
          pagination={{
            enabled: true,
            pageSize: 20,
            page: 0
          }}
        />
      </div>
    );
  }
}

InsightsTable.defaultProps = {
  application: [],
  columns: [],
  actions: {}
};

InsightsTable.propTypes = {
  authorization: React.PropTypes.string
};

export default InsightsTable;
