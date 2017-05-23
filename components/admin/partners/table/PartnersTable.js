import React from 'react';
import Spinner from 'components/ui/Spinner';
import CustomTable from 'components/ui/customtable/CustomTable';
import DeleteAction from 'components/ui/customtable/actions/DeleteAction';
import EditAction from 'components/ui/customtable/actions/EditAction';
import { get } from 'utils/request';

class PartnersTable extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      partners: [],
      loading: true
    };
  }

  componentDidMount() {
    this.getPartners();
  }

  /**
   * HELPERS
   * - getPartners
  */
  getPartners() {
    get(
      {
        url: `${process.env.BACKOFFICE_API_URL}/api/partners`,
        headers: [
          { key: 'Content-Type', value: 'application/json' },
          { key: 'Authorization', value: this.props.authorization }
        ],
        onSuccess: response => {
          console.log('success!');
          console.log(response);
          const partners = response.data.map(partner =>
            Object.assign({}, partner.attributes, {
              id: partner.id
            })
          );
          this.setState({ partners, loading: false });
        },
        onError: error => {
          this.setState({ message: `Error loading partners: ${error}`, loading: false });
        }
      }
    );
  }

  render() {
    return (
      <div className="c-partners-table">
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
              { name: 'Edit', path: '/admin/partners/:id/edit', show: true, component: EditAction },
              {
                name: 'Remove',
                path: '/admin/partners/:id/remove',
                show: true,
                component: DeleteAction,
                componentProps: { url: `${process.env.WRI_API_URL}/partners` }
              }
            ]
          }}
          data={this.state.partners}
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

PartnersTable.defaultProps = {
  application: ['rw'],
  columns: [],
  actions: {}
};

PartnersTable.propTypes = {
  authorization: React.PropTypes.string
};

export default PartnersTable;
