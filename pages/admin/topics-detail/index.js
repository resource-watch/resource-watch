import React from 'react';
import PropTypes from 'prop-types';
import { singular } from 'pluralize';

// Redux
import withRedux from 'next-redux-wrapper';
import { initStore } from 'store';

// Services
import { getTopic } from 'modules/topics/actions';

// Utils
import { capitalizeFirstLetter } from 'utils/utils';

// Layout
import Page from 'layout/page';
import Layout from 'layout/layout/layout-admin';

// Tabs
import TopicsTab from 'components/admin/topics/TopicsTab';
import Breadcrumbs from 'components/ui/Breadcrumbs';

// Components
import Title from 'components/ui/Title';

class AdminTopicsDetailPage extends Page {
  static propTypes = { topic: PropTypes.object }

  static defualtProps = { topic: null }

  static async getInitialProps(context) {
    const props = await super.getInitialProps(context);
    const { store } = context;
    const { url: { query: { id } } } = props;

    // fetchs the topic data
    if (id && id !== 'new') await store.dispatch(getTopic(id));

    return props;
  }

  constructor(props) {
    super(props);

    const { tab, id, subtab } = props.url.query;

    this.state = {
      tab,
      id,
      subtab,
      data: {}
    };
  }

  componentWillReceiveProps(nextProps) {
    const { tab, id, subtab } = nextProps.url.query;

    this.setState({ tab, id, subtab });
  }


  /**
   * HELPERS
   * - getName
  */
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
    const { url } = this.props;
    const { query: { id, tab, subtab } } = url;

    return (
      <Layout
        title={this.getName()}
        // TO-DO: fill description
        description="Topics detail..."
        url={url}
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

export default withRedux(
  initStore,
  state => ({ topic: state.topics.detail.data }),
  null
)(AdminTopicsDetailPage);
