import React from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';

// Redux
import withRedux from 'next-redux-wrapper';
import { getStaticData } from 'redactions/static_pages';
import { initStore } from 'store';

// Next components
import { Link } from 'routes';

// Components
import Page from 'components/app/layout/Page';
import Layout from 'components/app/layout/Layout';
import Title from 'components/ui/Title';
import Banner from 'components/app/common/Banner';
import Breadcrumbs from 'components/ui/Breadcrumbs';

class GetInvolved extends Page {
  componentWillMount() {
    const { url, data } = this.props;
    const id = url.query.id;

    if (isEmpty(data[id])) {
      this.props.getStaticData(id);
    }
  }

  render() {
    const { url, user, data } = this.props;
    const id = url.query.id;
    const selectedData = data[id];
    const styles = {};

    if (!data) return null;

    if (data && data.photo) {
      styles.backgroundImage = `url(${process.env.STATIC_SERVER_URL}${data.photo.large})`;
    }

    return (
      <Layout
        title={data.title || 'Get Involved detail'}
        description={data.summary || 'Get Involved summary'}
        url={url}
        user={user}
      >
        <header className="l-page-header">
          <div className="l-container">
            <div className="row">
              <div className="column small-12">
                <div className="page-header-content">
                  <Breadcrumbs items={[{ name: 'Data', href: '/data' }]} />
                  <h1>{selectedData.title}</h1>
                </div>
              </div>
            </div>
          </div>
        </header>

        <section className="l-section -secondary">
          <header className="l-section-header">
            <div className="l-container">
              <div className="row">
                <div className="column small-12">
                  <h2>
                    {selectedData.summary}
                  </h2>
                </div>
              </div>
            </div>
          </header>
        </section>

        <section className="l-content">
          <article className="l-content-body">
            <div className="l-container">
              <div className="row align-center">
                <div className="column small-12 medium-8">
                  <div dangerouslySetInnerHTML={{ __html: data && data.content }} />
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
                  <Link route="about_partners">
                    <a className="c-btn -primary -alt">Partners list</a>
                  </Link>
                </Banner>
              </div>
            </div>
          </div>
        </aside>
      </Layout>
    );
  }
}

GetInvolved.propTypes = {
  url: PropTypes.object,
  data: PropTypes.object,
  getStaticData: PropTypes.func
};

const mapStateToProps = state => ({
  data: state.staticPages
});

const mapDispatchToProps = dispatch => ({
  getStaticData: (slug) => {
    dispatch(getStaticData(slug));
  }
});

export default withRedux(initStore, mapStateToProps, mapDispatchToProps)(GetInvolved);
