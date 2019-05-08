import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

// components
import Spinner from 'components/ui/Spinner';
import CustomTable from 'components/ui/customtable/CustomTable';
import SearchInput from 'components/ui/SearchInput';
import EditAction from './actions/EditAction';
import DeleteAction from './actions/DeleteAction';

// TDs
import NameTD from './td/name';
import PublishedTD from './td/published';
import FeaturedTD from './td/featured';
import RoleTD from './td/role';

class AdminPartnersTable extends PureComponent {
  static propTypes = {
    authorization: PropTypes.string.isRequired,
    loading: PropTypes.bool.isRequired,
    list: PropTypes.array.isRequired,
    error: PropTypes.any,
    getAllPartners: PropTypes.func.isRequired,
    setFilters: PropTypes.func.isRequired
  };

  static defaultProps = { error: null }

  /**
   * Event handler executed when the user search for a partner
   * @param {string} { value } Search keywords
   */
  onSearch = (value) => {
    if (!value.length) {
      this.props.setFilters([]);
    } else {
      this.props.setFilters([{ key: 'name', value }]);
    }
  }

  onRowDelete = () => {
    const { getAllPartners } = this.props;

    getAllPartners();
  }

  render() {
    const {
      list: partners,
      loading,
      error,
      authorization
    } = this.props;

    return (
      <div className="c-partners-table">
        <Spinner className="-light" isLoading={loading} />

        {error && (<p>Error: {error}</p>)}

        <SearchInput
          input={{ placeholder: 'Search partner' }}
          link={{
            label: 'New partner',
            route: 'admin_partners_detail',
            params: { tab: 'partners', id: 'new' }
          }}
          onSearch={this.onSearch}
        />

        {!error && (
          <CustomTable
            columns={[
              { label: 'Name', value: 'name', td: NameTD },
              { label: 'Role', value: 'role', td: RoleTD },
              { label: 'Partner type', value: 'partner-type' },
              { label: 'Featured', value: 'featured', td: FeaturedTD },
              { label: 'Published', value: 'published', td: PublishedTD }
            ]}
            actions={{
              show: true,
              list: [
                { name: 'Edit', route: 'admin_partners_detail', params: { tab: 'partners', subtab: 'edit', id: '{{id}}' }, show: true, component: EditAction },
                { name: 'Remove', route: 'admin_partners_detail', params: { tab: 'partners', subtab: 'remove', id: '{{id}}' }, component: DeleteAction, componentProps: { authorization } }
              ]
            }}
            sort={{
              field: 'name',
              value: 1
            }}
            filters={false}
            data={partners}
            pageSize={20}
            onRowDelete={this.onRowDelete}
            pagination={{
              enabled: true,
              pageSize: 20,
              page: 0
            }}
          />
        )}
      </div>
    );
  }
}

export default AdminPartnersTable;
