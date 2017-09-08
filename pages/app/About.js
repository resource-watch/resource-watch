import React from 'react';
import PropTypes from 'prop-types';
import renderHTML from 'react-render-html';

import withRedux from 'next-redux-wrapper';
import { initStore } from 'store';
import { bindActionCreators } from 'redux';
import { getStaticData } from 'redactions/static_pages';
import { setUser } from 'redactions/user';
import { setRouter } from 'redactions/routes';

import { Link } from 'routes';
import Page from 'components/app/layout/Page';
import Layout from 'components/app/layout/Layout';
import Banner from 'components/app/common/Banner';

class About extends Page {
  static async getInitialProps({ asPath, pathname, query, req, store, isServer }) {
    const { user } = isServer ? req : store.getState();
    const url = { asPath, pathname, query };
    store.dispatch(setUser(user));
    store.dispatch(setRouter(url));
    await store.dispatch(getStaticData('about'));
    return { isServer, user, url };
  }

  componentDidMount() {
    if (!this.props.isServer) this.props.getStaticData('about');
  }

  render() {
    const { data } = this.props;

    if (!data) return null;

    const styles = {};
    if (data && data.photo) {
      styles.backgroundImage = `url(${process.env.STATIC_SERVER_URL}${data.photo.cover})`;
    }

    return (
      <Layout
        title="About"
        description="About description..."
        url={this.props.url}
        user={this.props.user}
        className="l-static p-about"
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
          <article className="l-content-body">
            <div className="l-container">
              <div className="row align-center">
                <div className="column small-12 medium-8">
                  {renderHTML(data.content || '')}
                </div>
              </div>
            </div>
          </article>
        </section>

        <aside className="l-postcontent">
          <div className="l-container">
            <div className="row align-center">
              <div className="column small-12">
                <Banner className="-text-center" bgImage={'/static/images/backgrounds/partners-02@2x.jpg'}>
                  <p className="-claim">We have a massive opportunity<br />to build a sustainable society</p>
                  <Link href="about_partners"><a className="c-button -alt -primary">Partners list</a></Link>
                </Banner>
              </div>
            </div>
          </div>
        </aside>

      </Layout>
    );
  }
}

About.propTypes = {
  url: PropTypes.object,
  isServer: PropTypes.bool,
  data: PropTypes.object,
  getStaticData: PropTypes.func
};

const mapStateToProps = state => ({
  data: state.staticPages.about
});

const mapDispatchToProps = dispatch => ({
  getStaticData: bindActionCreators(slug => getStaticData(slug), dispatch)
});

export default withRedux(initStore, mapStateToProps, mapDispatchToProps)(About);
