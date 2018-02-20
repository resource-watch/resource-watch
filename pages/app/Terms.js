import React from 'react';
import PropTypes from 'prop-types';
import renderHTML from 'react-render-html';

import withRedux from 'next-redux-wrapper';
import { initStore } from 'store';
import { getStaticData } from 'redactions/static_pages';

import Page from 'components/app/layout/Page';
import Layout from 'components/app/layout/Layout';

class Terms extends Page {
  static async getInitialProps(context) {
    const props = await super.getInitialProps(context);

    // Get static data
    await context.store.dispatch(getStaticData('terms-of-service'));
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
        title="Terms of service"
        description="Terms of service description"
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

Terms.propTypes = {
  data: PropTypes.object,
  getStaticData: PropTypes.func
};

const mapStateToProps = state => ({
  data: state.staticPages['terms-of-service']
});

const mapDispatchToProps = {
  getStaticData
};

export default withRedux(initStore, mapStateToProps, mapDispatchToProps)(Terms);
