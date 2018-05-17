import React from 'react';
import PropTypes from 'prop-types';
import renderHTML from 'react-render-html';

import withRedux from 'next-redux-wrapper';
import { initStore } from 'store';
import { getStaticData } from 'redactions/static_pages';

import Page from 'layout/page';
import Layout from 'layout/layout/layout-app';

class AttributionRequirements extends Page {
  static async getInitialProps(context) {
    const props = await super.getInitialProps(context);

    // Get static data
    await context.store.dispatch(getStaticData('api-attribution-requirements'));
    return { ...props };
  }

  render() {
    const { data } = this.props;
    const styles = {};

    if (!data) return null;

    if (data && data.photo) {
      styles.backgroundImage = `url(${process.env.STATIC_SERVER_URL}${data.photo.cover})`;
    }

    return (
      <Layout
        title="Attribution requirements"
        description="Attribution requirements description"
        url={this.props.url}
        user={this.props.user}
        className="l-static"
      >
        <section className="l-content">
          <header className="l-content-header">
            <div className="cover" style={styles}>
              <div className="row">
                <div className="column small-12">
                  <div className="content">
                    <h1>{data.title}</h1>
                    <p>{data.summary}</p>
                  </div>
                </div>
              </div>
            </div>
          </header>
          <div className="l-content-body">
            {!!data.content &&
              <div className="l-container">
                <article>
                  <div className="row align-center">
                    <div className="column small-12 medium-8">
                      <div className="c-terms">
                        {renderHTML(data.content || '')}
                      </div>
                    </div>
                  </div>
                </article>
              </div>
            }
          </div>
        </section>
      </Layout>
    );
  }
}

AttributionRequirements.propTypes = {
  data: PropTypes.object,
  getStaticData: PropTypes.func
};

const mapStateToProps = state => ({
  data: state.staticPages['api-attribution-requirements']
});

const mapDispatchToProps = {
  getStaticData
};

export default withRedux(initStore, mapStateToProps, mapDispatchToProps)(AttributionRequirements);
