import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

// components
import Layout from 'layout/layout/layout-app';
import DashboardWidgetCard from 'layout/app/dashboard-detail/dashboard-widget-card';
import WidgetDetailHeader from './widget-detail-header';

class LayoutWidgetDetail extends PureComponent {
  static propTypes = { widget: PropTypes.object };

  static defaultProps = { widget: {} }

  UNSAFE_componentWillMount() {
    if (typeof window !== 'undefined') window.scrollTo(0, 0);
  }

  render() {
    const { widget } = this.props;

    return (
      <Layout
        title={widget.name}
        description={widget.description || ''}
        thumbnail={widget.thumbnailUrl}
        pageHeader
      >
        <div className="c-page-explore-detail">
          {/* PAGE HEADER */}
          <div className="c-page-header">
            <div className="l-container">
              <div className="row">
                <div className="column">
                  <WidgetDetailHeader widget={widget} />
                </div>
              </div>
            </div>
          </div>

          <div className="l-section">
            <div className="l-container">
              <div className="row">
                <div className="column">
                  {/* I'm using this component but we need to create a proper one */}
                  { typeof window !== 'undefined' && 
                    <DashboardWidgetCard
                      widget={widget}
                      loading={false}
                    />
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }
}

export default LayoutWidgetDetail;
