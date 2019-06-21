import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

// components
import Tabs from 'components/ui/Tabs';
import Spinner from 'components/ui/Spinner';
import Paginator from 'components/ui/Paginator';
import SearchInput from 'components/ui/SearchInput';
import WidgetList from 'components/widgets/list/WidgetList';

// styles
import './styles.scss';

class WidgetBlockEdition extends PureComponent {
  static propTypes = {
    data: PropTypes.object.isRequired,
    onChangeTab: PropTypes.func.isRequired,
    onChangePage: PropTypes.func.isRequired,
    onChangeSearch: PropTypes.func.isRequired,
    onSelectWidget: PropTypes.func.isRequired
  }

  render() {
    const {
      data: { tab, loading, total, page, pages, pageSize, widgets },
      onChangeTab,
      onChangePage,
      onChangeSearch,
      onSelectWidget
    } = this.props;

    return (
      <div className="c-dashboard-widget-edition">
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

          <div className="dock-widget-container">
            <div className="c-page-section -small">
              <div className="l-container">
                <div className="row">
                  <div className="column small-12">
                    <SearchInput
                      input={{ placeholder: 'Search visualization' }}
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

                    {pages > 1 &&
                      <Paginator
                        options={{
                          size: total,
                          page,
                          pages,
                          limit: pageSize
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
      </div>
    );
  }
}

export default WidgetBlockEdition;
