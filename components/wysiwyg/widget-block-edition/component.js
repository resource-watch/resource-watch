import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

// styles
import 'components/wysiwyg/widget-block-edition/styles.scss';

// components
import Tabs from 'components/ui/Tabs';
import Spinner from 'components/ui/Spinner';
import Paginator from 'components/ui/Paginator';
import SearchInput from 'components/ui/SearchInput';
import WidgetCardList from 'components/widgets/card-list';

class WidgetBlockEdition extends PureComponent {
  static propTypes = {
    onChangeTab: PropTypes.func.isRequired,
    onChangePage: PropTypes.func.isRequired,
    onChangeSearch: PropTypes.func.isRequired,
    onSelectWidget: PropTypes.func.isRequired,
    tab: PropTypes.string.isRequired,
    loading: PropTypes.bool.isRequired,
    total: PropTypes.number.isRequired,
    page: PropTypes.number.isRequired,
    pages: PropTypes.number.isRequired,
    pageSize: PropTypes.number.isRequired,
    widgets: PropTypes.array.isRequired
  };

  render() {
    const {
      tab,
      loading,
      total,
      page,
      pages,
      pageSize,
      widgets,
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

                    <WidgetCardList
                      widgets={widgets}
                      mode="grid"
                      onWidgetClick={onSelectWidget}
                      showFavourite={false}
                    />

                    {pages > 1 && (
                      <Paginator
                        options={{
                          size: total,
                          page,
                          pages,
                          limit: pageSize
                        }}
                        onChange={onChangePage}
                      />
                    )}
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
