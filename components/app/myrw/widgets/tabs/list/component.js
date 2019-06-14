import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Link } from 'routes';
import { StickyContainer, Sticky } from 'react-sticky';

// components
import Icon from 'components/ui/Icon';
import Spinner from 'components/ui/Spinner';
import SearchInput from 'components/ui/SearchInput';
import CollectionListAside from 'components/collection-list-aside';
import WidgetList from 'components/widgets/list/WidgetList';
import Paginator from 'components/ui/Paginator';

// constants
import { WIDGET_LIST_SUBTABS } from './constants';

// styles
import './styles.scss';

class MyRWWidgets extends PureComponent {
  static propTypes = {
    display: PropTypes.oneOf(['grid', 'list']).isRequired,
    sort: PropTypes.oneOf(['asc', 'desc']).isRequired,
    routes: PropTypes.object.isRequired,
    pagination: PropTypes.object.isRequired,
    widgets: PropTypes.object.isRequired,
    sideTab: PropTypes.string.isRequired,
    search: PropTypes.string.isRequired,
    handleSortChange: PropTypes.func.isRequired,
    handleSearch: PropTypes.func.isRequired,
    handleDisplay: PropTypes.func.isRequired,
    handlePageChange: PropTypes.func.isRequired,
    handleWidgetRemoved: PropTypes.func.isRequired,
    handleRefresh: PropTypes.func.isRequired
  };

  render() {
    const {
      display,
      search,
      widgets,
      sort,
      routes,
      pagination,
      sideTab,
      handlePageChange,
      handleDisplay,
      handleSearch,
      handleSortChange,
      handleWidgetRemoved,
      handleRefresh
    } = this.props;
    const { page, size, limit, pages } = pagination;
    const sortIcon = classnames({
      'icon-arrow-up': sort === 'asc',
      'icon-arrow-down': sort !== 'asc'
    });

    const gridIconClass = classnames({ '-active': display === 'grid' });
    const listIconClass = classnames({ '-active': display === 'list' });

    const {
      list: _widgets,
      loading,
      error
    } = widgets;

    return (
      <div className="c-myrw-widgets-list">
        <StickyContainer>
          <div className="row l-row">
            <div className="columns small-12 medium-3">
              <Sticky>
                {
                  ({ style }) => (
                    <div style={style}>
                      <CollectionListAside
                        additionalTabs={WIDGET_LIST_SUBTABS}
                        selected={sideTab}
                      />
                    </div>
                  )
                }
              </Sticky>
            </div>

            <div className="columns small-12 medium-9">
              <div className="c-my-rw">
                <SearchInput
                  input={{
                    placeholder: 'Search visualization',
                    value: search
                  }}
                  link={{
                    label: 'New visualization',
                    route: routes.detail,
                    onlyDesktop: true,
                    params: { tab: 'widgets', id: 'new' }
                  }}
                  onSearch={(value) => { handleSearch(value); }}
                />
                <div className="row">
                  <div className="column small-12">
                    <div className="list-actions">
                      <div className="buttons-container">
                        <button
                          className="last-modified-container"
                          onClick={() => { handleSortChange(); }}
                        >
                          <a>Last modified</a>
                          <Icon
                            className="-small"
                            name={sortIcon}
                          />
                        </button>
                        <div className="mode-buttons">
                          <button
                            className={gridIconClass}
                            onClick={() => handleDisplay('grid')}
                            title="Grid view"
                          >
                            <Icon name="icon-view-grid" />
                          </button>
                          <button
                            className={listIconClass}
                            onClick={() => handleDisplay('list')}
                            title="List view"
                          >
                            <Icon name="icon-list-mode" />
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="widget-list-container">
                      <Spinner
                        isLoading={loading}
                        className="-light"
                      />
                      <WidgetList
                        isLoading={loading}
                        widgets={_widgets}
                        mode={display}
                        onWidgetRemove={handleWidgetRemoved}
                        showActions
                        showRemove
                      />
                      {(pages > 1) && (
                        <Paginator
                          options={{
                            size,
                            page,
                            limit
                          }}
                          onChange={(nextPage) => { handlePageChange(nextPage); }}
                        />
                      )}
                      {(!_widgets.length && !loading && !error && !search) && (
                        <div className="user-message-container">You currently have no visualizations</div>
                      )}
                      {(!_widgets.length && !loading && !error && search) && (
                        <div className="user-message-container">Your search didn&apos;t return any results</div>
                      )}

                      {error && (
                        <div className="user-message-container">
                          There was an issue retrieving your visualizations, please
                          <button
                            type="button"
                            className="c-button -underline"
                            onClick={() => { handleRefresh(); }}
                          >
                            try again
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="c-button-container -j-center c-field-buttons">
                  <Link route="explore">
                    <a className="c-button -secondary">
                      Explore Datasets
                    </a>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </StickyContainer>
      </div>
    );
  }
}

export default MyRWWidgets;
