import React, { PureComponent } from 'react';
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

// constants
import { INITIAL_PAGINATION } from './constants';

// Table components
import EditAction from './actions/EditAction';
import DeleteAction from './actions/DeleteAction';

// TDs
import NameTD from './td/NameTD';
import RelatedContentTD from './td/RelatedContentTD';

class CollectionsList extends PureComponent {
  static propTypes = {
    routes: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
    collections: PropTypes.object.isRequired,
    filteredCollections: PropTypes.array.isRequired,
    setUserCollectionsFilter: PropTypes.func.isRequired
  };

  state = { pagination: INITIAL_PAGINATION };

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { filteredCollections } = this.props;
    const { filteredCollections: nextCollections } = nextProps;
    const { pagination } = this.state;
    const collectionsChanged = filteredCollections.length !== nextCollections.length;

    this.setState({
      pagination: {
        ...pagination,
        size: nextCollections.length,
        ...(collectionsChanged && { page: 1 }),
        pages: Math.ceil(nextCollections.length / pagination.limit)
      }
    });
  }

  onSearch = (value) => {
    this.props.setUserCollectionsFilter(value);
  };

  onChangePage = (page) => {
    const { pagination } = this.state;

    this.setState({
      pagination: {
        ...pagination,
        page
      }
    });
  };

  render() {
    const { routes, collections, filteredCollections, user } = this.props;
    const { pagination } = this.state;

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
        {!collections.loading && (
          <CustomTable
            columns={[
              {
                label: 'Name',
                value: 'name',
                td: NameTD,
                tdProps: { route: routes.detail },
                params: { tab: 'collections', id: '{{id}}' }
              },
              {
                label: 'Related content',
                value: 'resources',
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
            manualPagination
            onChangePage={this.onChangePage}
            pagination={pagination}
          />
        )}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user,
  filteredCollections: getUserCollections(state)
});

const mapDispatchToProps = dispatch => ({ setUserCollectionsFilter: value => dispatch(setUserCollectionsFilter(value)) });

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CollectionsList);
