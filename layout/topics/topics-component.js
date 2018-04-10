/* eslint max-len: 0 */
import React from 'react';
import PropTypes from 'prop-types';

import { Router } from 'routes';

// Redux
import { connect } from 'react-redux';

// Components
import Layout from 'layout/layout/layout-app';
import TopicThumbnailList from 'components/topics/thumbnail-list';
import Banner from 'components/app/common/Banner';

class TopicsComponent extends React.PureComponent {
  render() {
    const { data } = this.props;

    const styles = {};
    if (data && data.photo) {
      styles.backgroundImage = `url(${process.env.STATIC_SERVER_URL}${data.photo.cover})`;
    }

    return (
      <Layout
        title="Topics"
        description="Resource Watch Topics"
        className="l-static p-topics"

      >

        <div className="l-content">
          <div className="l-content-header">
            <div className="cover" style={styles}>
              <div className="row">
                <div className="column small-12">
                  <div className="content">
                    <h1>{data.title || 'Topics'}</h1>
                    <p>{data.summary || ''}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="l-section -small">
          <div className="l-container">
            <div className="row">
              <div className="column small-12">
                <TopicThumbnailList
                  onSelect={({ slug }) => {
                    // We need to make an amendment in the Wysiwyg to have this working
                    Router.pushRoute('topics_detail', { id: slug })
                      .then(() => {
                        window.scrollTo(0, 0);
                      });
                  }}
                />
              </div>
            </div>
          </div>
        </div>
        <aside className="l-postcontent">
          <div className="l-container">
            <div className="row align-center">
              <div className="column small-12">
                <Banner className="-text-center">
                  <p className="-claim">
                    Create and share <br />custom visualizations.
                  </p>
                  <a href='/myrw/dashboards'className="c-button -alt -primary">Create a dashboard</a>
                </Banner>
              </div>
            </div>
          </div>
        </aside>
      </Layout>
    );
  }
}

TopicsComponent.propTypes = {
  data: PropTypes.object
};

const mapStateToProps = state => ({
  data: state.staticPages.topics
});

export default connect(mapStateToProps, null)(TopicsComponent);
