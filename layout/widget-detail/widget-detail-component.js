import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

// components
import Layout from 'layout/layout/layout-app';
import WidgetDetailHeader from 'layout/widget-detail/widget-detail-header';
import WidgetCard from 'components/widgets/list/WidgetCard';

class WidgetDetailComponent extends PureComponent {
  static propTypes = { widgetDetail: PropTypes.object.isRequired };

  render() {
    const { widgetDetail: { data: widget } } = this.props;

    return (
      <Layout
        title={widget.name}
        description={widget.description || ''}
        category="Widget"
        pageHeader
      >
        <div className="c-page-explore-detail">
          {/* PAGE HEADER */}
          <div className="c-page-header">
            <div className="l-container">
              <div className="row">
                <div className="column small-12">
                  <WidgetDetailHeader />
                </div>
              </div>
            </div>
          </div>

          <div className="l-section">
            <div className="l-container">
              <div className="row">
                <div className="column small-12">
                  {/* I'm using this component but we need to create a proper one */}
                  <WidgetCard
                    widget={widget}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }
}

export default WidgetDetailComponent;
