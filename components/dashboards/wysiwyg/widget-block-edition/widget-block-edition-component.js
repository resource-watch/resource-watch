import React from 'react';
import PropTypes from 'prop-types';

// Components
import Tabs from 'components/ui/Tabs';
import Spinner from 'components/ui/Spinner';
import Paginator from 'components/ui/Paginator';
import SearchInput from 'components/ui/SearchInput';
import WidgetList from 'components/widgets/list/WidgetList';

export default function WidgetBlockEdition({
  data,
  onChangeTab,
  onSelectWidget,
  onChangePage,
  onChangeSearch
}) {
  return (
    <div className="c-dashboard-widget-edition">
      <div className="l-page">
        <div className="c-page-header -admin">
          <div className="l-container">
            <div className="row">
              <div className="column small-12">
                <div className="page-header-content -with-tabs">
                  <h1>Select widget</h1>
                  <Tabs
                    options={[
                      { label: 'My widgets', value: 'my-widgets' },
                      { label: 'All widgets', value: 'all-widgets' }
                    ]}
                    defaultSelected={data.tab}
                    selected={data.tab}
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
                    placeholder: 'Search widget'
                  }}
                  link={{}}
                  onSearch={onChangeSearch}
                />

                <Spinner isLoading={data.loading} className="-relative -small -light" />

                <WidgetList
                  widgets={data.widgets}
                  mode="grid"
                  onWidgetClick={onSelectWidget}
                />

                <Paginator
                  options={{
                    size: data.total,
                    page: data.page,
                    limit: data.pageSize || 9
                  }}
                  onChange={onChangePage}
                />

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

WidgetBlockEdition.defaultProps = {
  data: {},
  user: {},
  onChangeTab: null,
  onChangePage: null,
  onChangeSearch: null,
  onSelectWidget: null
};
