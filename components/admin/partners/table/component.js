import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

// constants
import { INITIAL_PAGINATION } from 'components/datasets/table/constants';

// components
import Spinner from 'components/ui/Spinner';
import CustomTable from 'components/ui/customtable/CustomTable';
import SearchInput from 'components/ui/SearchInput';
import EditAction from './actions/EditAction';
import DeleteAction from './actions/DeleteAction';
import NameTD from './td/NameTD';
import PublishedTD from './td/PublishedTD';
import FeaturedTD from './td/FeaturedTD';

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

  state = { pagination: INITIAL_PAGINATION }

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
    const { pagination } = this.state;
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
            pagination={pagination}
          />
        )}
      </div>
    );
  }
}

export default AdminPartnersTable;
