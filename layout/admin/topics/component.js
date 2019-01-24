import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

// components
import Layout from 'layout/layout/layout-admin';
import Tabs from 'components/ui/Tabs';
import TopicsTab from 'components/admin/topics/TopicsTab';
import Title from 'components/ui/Title';

// constants
import { DATA_TABS } from './constants';


class AdminTopics extends PureComponent {
  static propTypes = { url: PropTypes.object.isRequired };

  state = {
    tab: this.props.url.query.tab || 'topics',
    id: this.props.url.query.id,
    subtab: this.props.url.query.subtab
  }

  componentWillReceiveProps(nextProps) {
    const { url } = nextProps;

    this.setState({
      tab: url.query.tab || 'topics',
      id: url.query.id,
      subtab: url.query.subtab
    });
  }

  render() {
    const {
      tab,
      subtab,
      id
    } = this.state;

    return (
      <Layout
        title="Topics"
        // TO-DO: fill description
        description="Topics description..."
      >
        <div className="c-page-header -admin">
          <div className="l-container -admin">
            <div className="row">
              <div className="column small-12">
                <div className="page-header-content -with-tabs">
                  <Title className="-primary -huge page-header-title" >
                    Topics
                  </Title>
                  <Tabs
                    options={DATA_TABS}
                    defaultSelected={tab}
                    selected={tab}
                  />
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


export default AdminTopics;
