import React from 'react';
import PropTypes from 'prop-types';

// Redux
import { connect } from 'react-redux';

// Selectors
// import getFilteredDatasets from 'selectors/admin/datasets';

// Components
import Spinner from 'components/ui/Spinner';
import CustomTable from 'components/ui/customtable/CustomTable';
import SearchInput from 'components/ui/SearchInput';

// Table components
import EditAction from './actions/EditAction';
import DeleteAction from './actions/DeleteAction';

// TDs
import NameTD from './td/NameTD';
import RelatedContentTD from './td/RelatedContentTD';

class CollectionsList extends React.Component {
  constructor(props) {
    super(props);

    this.onSearch = this.onSearch.bind(this);
  }

  componentDidMount() {

  }

  /**
   * Event handler executed when the user search for a dataset
   * @param {string} { value } Search keywords
   */
  onSearch(value) {
    console.log('search', value);
  }

  getCollections() {
    const { user } = this.props;
    return user.collections.items;
  }

  render() {
    const { routes } = this.props;

    return (
      <div className="c-dataset-table">
        <Spinner className="-light" isLoading={this.props.loading} />

        <SearchInput
          input={{
            placeholder: 'Search collections'
          }}
          link={{
            label: 'New Collection',
            route: routes.detail,
            params: { tab: 'collections', id: 'new' }
          }}
          onSearch={this.onSearch}
        />

        <CustomTable
          columns={[
            {
              label: 'Name',
              value: 'attributes',
              td: NameTD,
              tdProps: { route: routes.detail }
            },
            {
              label: 'Related content',
              value: 'attributes',
              td: RelatedContentTD,
              tdProps: { route: routes.detail }
            }
          ]}
          actions={{
            show: true,
            list: [
              {
                name: 'Edit',
                route: routes.detail,
                params: { tab: 'datasets', subtab: 'edit', id: '{{id}}' },
                show: true,
                component: EditAction,
                componentProps: { route: routes.detail }
              },
              {
                name: 'Remove',
                route: routes.detail,
                params: { tab: 'datasets', subtab: 'remove', id: '{{id}}' },
                component: DeleteAction,
                componentProps: { authorization: this.props.user.token }
              }
            ]
          }}
          sort={{
            field: 'updatedAt',
            value: -1
          }}
          filters={false}
          data={this.getCollections()}
          onRowDelete={() => this.getCollections()}
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

CollectionsList.defaultProps = {
  routes: {
    index: '',
    detail: ''
  }
};

CollectionsList.propTypes = {
  routes: PropTypes.object,

  // Store
  user: PropTypes.object
};

const mapStateToProps = state => ({
  user: state.user
});

const mapDispatchToProps = {
  // getDatasets
};

export default connect(mapStateToProps, mapDispatchToProps)(CollectionsList);
