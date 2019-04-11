import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { singular } from 'pluralize';

// components
import Layout from 'layout/layout/layout-admin';
import TopicsTab from 'components/admin/topics/TopicsTab';
import Breadcrumbs from 'components/ui/Breadcrumbs';
import Title from 'components/ui/Title';

// utils
import { capitalizeFirstLetter } from 'utils/utils';

class AdminTopicsDetailLayout extends PureComponent {
  static propTypes = {
    url: PropTypes.object.isRequired,
    topic: PropTypes.object.isRequired,
    hostname: PropTypes.string.isRequired
  };

  getName() {
    const {
      url: { query: { id, tab } },
      topic
    } = this.props;

    if (id === 'new') return `New ${singular(tab)}`;

    if (topic && topic.name) return topic.name;

    return '-';
  }

  render() {
    const { url, hostname } = this.props;
    const { query: { id, tab, subtab } } = url;

    return (
      <Layout
        title={this.getName()}
        // TO-DO: fill description
        description="Topics detail..."
        hostname={hostname}
      >
        <div className="c-page-header -admin">
          <div className="l-container -admin">
            <div className="row">
              <div className="column small-12">
                <div className="page-header-content">
                  <Breadcrumbs
                    items={[{ name: capitalizeFirstLetter(tab), route: 'admin_topics', params: { tab } }]}
                  />
                  <Title className="-primary -huge page-header-title" >
                    {this.getName()}
                  </Title>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="c-page-section">
          <div className="l-container -admin">
            <div className="row">
              <div className="column small-12">
                {tab === 'topics' &&
                  <TopicsTab tab={tab} subtab={subtab} id={id} />
                }
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }
}

export default AdminTopicsDetailLayout;
