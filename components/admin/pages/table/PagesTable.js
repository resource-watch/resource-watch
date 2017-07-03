import React from 'react';
import Spinner from 'components/ui/Spinner';
import CustomTable from 'components/ui/customtable/CustomTable';
import DeleteAction from 'components/ui/customtable/actions/DeleteAction';
import EditAction from 'components/ui/customtable/actions/EditAction';
import { get } from 'utils/request';

class PagesTable extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      pages: [],
      loading: true
    };
  }

  componentDidMount() {
    this.getPages();
  }

  /**
   * HELPERS
   * - getPages
  */
  getPages() {
    get(
      {
        url: `${process.env.BACKOFFICE_API_URL}/static_pages`,
        headers: [
          { key: 'Content-Type', value: 'application/json' },
          { key: 'Authorization', value: this.props.authorization }
        ],
        onSuccess: (response) => {
          console.log('success!');
          console.log(response);
          const pages = response.data.map(page =>
            Object.assign({}, page.attributes, {
              id: page.id
            })
          );
          this.setState({ pages, loading: false });
        },
        onError: (error) => {
          this.setState({ message: `Error loading pages: ${error}`, loading: false });
        }
      }
    );
  }

  render() {
    return (
      <div className="c-pages-table">
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
              { name: 'Edit', path: '/admin/pages/:id/edit', show: true, component: EditAction },
              { name: 'Remove', path: '/admin/pages/:id/remove', show: true, component: DeleteAction }
            ]
          }}
          data={this.state.pages}
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

PagesTable.defaultProps = {
  application: ['rw'],
  columns: [],
  actions: {}
};

PagesTable.propTypes = {
  authorization: React.PropTypes.string
};

export default PagesTable;
