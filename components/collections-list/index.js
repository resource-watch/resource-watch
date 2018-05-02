import React from 'react';
import PropTypes from 'prop-types';

// Redux
import { connect } from 'react-redux';

import { setUserCollectionsFilter } from 'redactions/user';

// Selectors
import getUserCollections from 'selectors/myrw/collections';

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
  static defaultProps = {
    routes: {
      index: '',
      detail: ''
    }
  };

  static propTypes = {
    routes: PropTypes.object,
    user: PropTypes.object,
    collections: PropTypes.object,
    filteredCollections: PropTypes.array,
    setUserCollectionsFilter: PropTypes.func
  };

  constructor(props) {
    super(props);
    this.onSearch = this.onSearch.bind(this);
  }

  onSearch(value) {
    this.props.setUserCollectionsFilter(value);
  }

  render() {
    const {
      routes,
      collections,
      filteredCollections,
      user
    } = this.props;

    return (
      <div className="c-dataset-table">

        <Spinner className="-light" isLoading={collections.loading} />

        <SearchInput
          input={{
            placeholder: 'Search collections',
            value: collections.filter
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
          data={filteredCollections}
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

const mapStateToProps = state => ({
  user: state.user,
  filteredCollections: getUserCollections(state)
});

const mapDispatchToProps = dispatch => ({
  setUserCollectionsFilter: value => dispatch(setUserCollectionsFilter(value))
});

export default connect(mapStateToProps, mapDispatchToProps)(CollectionsList);
