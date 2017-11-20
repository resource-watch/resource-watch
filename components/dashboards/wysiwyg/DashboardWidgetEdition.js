import React from 'react';
import PropTypes from 'prop-types';

// Redux
import { connect } from 'react-redux';

import { toastr } from 'react-redux-toastr';

// Services
import WidgetsService from 'services/WidgetsService';

// Components
import Tabs from 'components/ui/Tabs';
import Spinner from 'components/ui/Spinner';
import DashboardWidget from './DashboardWidget';

class DashboardWidgetEdition extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      tab: 'my-widgets',
      widgetsLoading: true,
      widgets: [],
      widgetCollections: [],
      widgetsSelected: []
    };

    this.widgetsService = new WidgetsService({
      user: props.user
    });
  }

  componentDidMount() {
    const promises = [
      this.widgetsService.fetchAllData({ includes: 'widget' }),
      this.widgetsService.fetchCollections()
    ];

    Promise.all(promises)
      .then((response) => {
        this.setState({
          widgets: response[0],
          widgetCollections: response[1],
          widgetsLoading: false
        });
      })
      .catch((err) => {
        this.setState({
          widgetsLoading: false
        });
        toastr.error(err);
      });
  }

  /**
   * UI EVENTS
   * - onChangeTab
   * - onSelect
  */

  onChangeTab = (tab) => {
    this.setState({ tab });
  }

  onSelect = (widget) => {
    this.props.onSubmit({
      widgetId: widget.id,
      categories: []
    });
  }

  render() {
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
                    defaultSelected={this.state.tab}
                    selected={this.state.tab}
                    onChange={this.onChangeTab}
                  />
                </div>
              </div>
            </div>
          </div>

          <Spinner isLoading={this.state.widgetsLoading} className="-light" />

          <div className="c-page-section dock-widget-container">
            {this.state.tab === 'my-widgets' &&
              <div className="l-row row">
                {this.state.widgets.filter(w => w.userId === this.props.user.id).map(w => (
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
                      onSelect={() => this.onSelect(w)}
                    />
                  </div>
                ))}
              </div>
            }
            {this.state.tab === 'all-widgets' &&
              <div className="l-row row">
                {this.state.widgets.filter(w => w.userId !== this.props.user.id).map(w => (
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
                      onSelect={() => this.onSelect(w)}
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
}

DashboardWidgetEdition.propTypes = {
  user: PropTypes.object,
  onSubmit: PropTypes.func
};

const mapStateToProps = state => ({
  user: state.user
});

export default connect(mapStateToProps, null)(DashboardWidgetEdition);
