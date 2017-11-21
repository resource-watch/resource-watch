import React from 'react';
import PropTypes from 'prop-types';

// Components
import Tabs from 'components/ui/Tabs';
import Spinner from 'components/ui/Spinner';
import DashboardWidget from '../DashboardWidget';

export default function WidgetBlockEdition({ data, user, onChangeTab, onSelect }) {
  return (
    <div className="c-dashboard-widget-edition">
      <div className="l-page">
        <div className="c-page-header -admin">
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

        <Spinner isLoading={data.loading} className="-light" />

        <div className="c-page-section dock-widget-container">
          {data.tab === 'my-widgets' &&
            <div className="l-row row">
              {data.widgets.filter(w => w.userId === user.id).map(w => (
                <div className="columns small-12 medium-4">
                  <DashboardWidget
                    key={w.id}
                    item={{
                      type: 'widget',
                      content: {
                        widgetId: w.id
                      }
                    }}
                    categories={[]}
                    onSelect={() => onSelect(w)}
                  />
                </div>
              ))}
            </div>
          }
          {data.tab === 'all-widgets' &&
            <div className="l-row row">
              {data.widgets.filter(w => w.userId !== user.id).map(w => (
                <div className="columns small-12 medium-4">
                  <DashboardWidget
                    key={w.id}
                    item={{
                      type: 'widget',
                      content: {
                        widgetId: w.id
                      }
                    }}
                    categories={[]}
                    onSelect={() => onSelect(w)}
                  />
                </div>
              ))}
            </div>
          }
        </div>
      </div>
    </div>
  );
}

WidgetBlockEdition.propTypes = {
  data: PropTypes.object,
  user: PropTypes.object,
  onChangeTab: PropTypes.func,
  onSelect: PropTypes.func
};

WidgetBlockEdition.defaultProps = {
  data: {},
  user: {},
  onChangeTab: null,
  onSelect: null
};
