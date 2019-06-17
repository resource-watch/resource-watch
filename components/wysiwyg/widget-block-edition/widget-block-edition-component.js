import React from 'react';
import PropTypes from 'prop-types';

// Components
import Tabs from 'components/ui/Tabs';
import Spinner from 'components/ui/Spinner';
import Paginator from 'components/ui/Paginator';
import SearchInput from 'components/ui/SearchInput';
import WidgetList from 'components/widgets/list/WidgetList';

export default function WidgetBlockEdition({
  data = {},
  user = {},
  onChangeTab = null,
  onChangePage = null,
  onChangeSearch = null,
  onSelectWidget = null
}) {

  const { tab, loading, total, page, pages, pageSize, widgets } = data;
  return (
    <div className="c-topic-widget-edition">
      <div className="l-page">
        <div className="c-page-header -admin">
          <div className="l-container">
            <div className="row">
              <div className="column small-12">
                <div className="page-header-content -with-tabs">
                  <h1>Select visualization</h1>
                  <Tabs
                    options={[
                      { label: 'My visualizations', value: 'my-widgets' },
                      { label: 'My favourites', value: 'my-favourites' },
                      { label: 'All visualizations', value: 'all-widgets' }
                    ]}
                    defaultSelected={tab}
                    selected={tab}
                    onChange={onChangeTab}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="c-page-section -small dock-widget-container">
          <div className="l-container">
            <div className="row">
              <div className="column small-12">

                <SearchInput
                  input={{
                    placeholder: 'Search visualization'
                  }}
                  link={{}}
                  onSearch={onChangeSearch}
                />

                <Spinner isLoading={loading} className="-relative -small -light" />

                <WidgetList
                  widgets={widgets}
                  mode="grid"
                  onWidgetClick={onSelectWidget}
                  showFavourite={false}
                />

                { pages >= 2 &&
                  <Paginator
                    options={{
                      size: total,
                      page,
                      pages,
                      limit: pageSize || 9
                    }}
                    onChange={onChangePage}
                  />
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

WidgetBlockEdition.propTypes = {
  data: PropTypes.object,
  onChangeTab: PropTypes.func,
  onChangePage: PropTypes.func,
  onChangeSearch: PropTypes.func,
  onSelectWidget: PropTypes.func
};
