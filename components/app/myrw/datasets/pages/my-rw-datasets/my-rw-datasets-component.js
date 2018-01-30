import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import { Router } from 'routes';

// utils
import debounce from 'lodash/debounce';

// components
import Icon from 'components/ui/Icon';
import SearchInput from 'components/ui/SearchInput';
import Paginator from 'components/ui/Paginator';
import DatasetsList from './dataset-list';


class MyRWDatasets extends PureComponent {
  static propTypes = {
    orderDirection: PropTypes.oneOf(['asc', 'desc']),
    filters: PropTypes.array,
    pagination: PropTypes.object,
    routes: PropTypes.object,
    subtab: PropTypes.string,
    setOrderDirection: PropTypes.func,
    setFilters: PropTypes.func,
    setPaginationPage: PropTypes.func,
    getDatasetsByTab: PropTypes.func
  }

  handleNewDataset = () => Router.pushRoute('myrw_detail', { tab: 'datasets', id: 'new' });

  handleSearch = debounce((value) => {
    if (!value.length) {
      this.props.setFilters([]);
    } else {
      this.props.setFilters([{ key: 'name', value }]);
    }

    this.props.getDatasetsByTab(this.props.subtab);
    this.props.setPaginationPage(1);
  }, 300)

  handleOrderChange = () => {
    const { setOrderDirection } = this.props;
    const orderDirection = this.props.orderDirection === 'asc' ? 'desc' : 'asc';

    setOrderDirection(orderDirection);
  }

  handlePageChange = page => this.props.setPaginationPage(page);

  render() {
    const { orderDirection, routes, pagination, filters } = this.props;
    const { page, total, limit } = pagination;
    const nameSearchValue = (filters.find(filter => filter.key === 'name') || {}).value || '';


    const iconName = classnames({
      'icon-arrow-up': orderDirection === 'asc',
      'icon-arrow-down': orderDirection !== 'asc'
    });

    return (
      <div className="c-my-rw">
        <SearchInput
          input={{
            placeholder: 'Search dataset',
            value: nameSearchValue
          }}
          link={{
            label: 'New dataset',
            route: routes.detail,
            params: { tab: 'datasets', id: 'new' }
          }}
          onSearch={this.handleSearch}
        />
        <div className="row">
          <div className="column small-12">
            <div className="list-actions">
              <div className="buttons-container">
                <button
                  className="last-modified-container"
                  onClick={this.handleOrderChange}
                >
                  <a>Last modified</a>
                  <Icon className="-small" name={iconName} />
                </button>
              </div>
            </div>
            <DatasetsList
              routes={{
                index: 'myrw',
                detail: 'myrw_detail'
              }}
            />
            {!!total && <Paginator
              options={{
                size: total,
                page,
                limit
              }}
              onChange={this.handlePageChange}
            />}
          </div>
        </div>
      </div>
    );
  }
}

export default MyRWDatasets;
