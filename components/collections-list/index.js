import React from 'react';
import PropTypes from 'prop-types';

import includes from 'lodash/includes';

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

    this.state = {
      filter: ''
    };

    this.onSearch = this.onSearch.bind(this);
  }

  onSearch(value) {
    this.setState({ filter: value });
  }

  getCollections() {
    const { collections } = this.props;
    const { filter } = this.state;

    if (filter && filter.length) {
      return collections.items.filter(col =>
        includes(col.attributes.name.toLowerCase(), filter.toLowerCase()));
    }

    return collections.items;
  }

  render() {
    const { routes, collections, user } = this.props;
    return (
      <div className="c-dataset-table">

        <Spinner className="-light" isLoading={collections.loading} />

        <SearchInput
          input={{
            placeholder: 'Search collections',
            value: this.state.filter
          }}
          link={{
            label: 'New Collection',
            route: routes.detail,
            params: { tab: 'collections', id: 'new' }
          }}
          onSearch={this.onSearch}
        />

        {!collections.loading && <CustomTable
          columns={[
            {
              label: 'Name',
              value: 'attributes',
              td: NameTD,
              tdProps: { route: routes.detail },
              params: { tab: 'collections', id: '{{id}}' }
            },
            {
              label: 'Related content',
              value: 'attributes',
              td: RelatedContentTD
            }
          ]}
          actions={{
            show: true,
            list: [
              {
                name: 'Edit',
                params: { tab: 'collections', subtab: '{{id}}' },
                show: true,
                component: EditAction
              },
              {
                name: 'Remove',
                route: routes.detail,
                params: { tab: 'collections', subtab: 'remove', id: '{{id}}' },
                component: DeleteAction,
                componentProps: { authorization: user.token }
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
        />}

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
  user: PropTypes.object,
  collections: PropTypes.object
};

const mapStateToProps = state => ({
  user: state.user
});

export default connect(mapStateToProps, null)(CollectionsList);
