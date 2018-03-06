import React from 'react';
import PropTypes from 'prop-types';

// Redux
import withRedux from 'next-redux-wrapper';
import { initStore } from 'store';

// Layout
import Page from 'components/layout/page';
import Layout from 'components/layout/layout/layout-admin';
import Tabs from 'components/ui/Tabs';

// Tabs
import TopicsTab from 'components/admin/topics/TopicsTab';

// Components
import Title from 'components/ui/Title';

// Contants
const DATA_TABS = [{
  label: 'Topics',
  value: 'topics',
  route: 'admin_topics',
  params: { tab: 'topics' }
}];

class Topics extends Page {
  constructor(props) {
    super(props);

    const { url } = props;

    this.state = {
      tab: url.query.tab || 'topics',
      id: url.query.id,
      subtab: url.query.subtab
    };
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
    const { url, user } = this.props;
    const { tab, subtab, id } = this.state;

    return (
      <Layout
        title="Topics"
        description="Topics description..."
        user={user}
        url={url}
      >
        {/* PAGE HEADER */}
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

Topics.propTypes = {
  user: PropTypes.object,
  url: PropTypes.object
};


export default withRedux(initStore, null, null)(Topics);
