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

    return (
      <Layout
        title={data.title || 'Get Involved detail'}
        description={data.summary || 'Get Involved summary'}
        url={url}
        user={user}
      >
        <div className="c-page">
          {/* PAGE HEADER */}
          <div className="c-page-header">
            <div className="l-container">
              <div className="page-header-content -padding-b-2">
                <Breadcrumbs
                  items={[{ name: 'Get Involved', route: 'get_involved' }]}
                />

                <Title className="-primary -huge page-header-title" >
                  {selectedData.title}
                </Title>
              </div>
            </div>
          </div>

          <section className="l-section -bg-grey">
            <div className="l-container">
              <header className="row">
                <div className="column small-12 medium-8">
                  <h1 className="c-text -header-big -primary -thin">{selectedData.summary}</h1>
                </div>
              </header>
              <div className="row description">
                <div
                  className="cols column small-12"
                  dangerouslySetInnerHTML={{ __html: selectedData.description }}
                />
              </div>
            </div>
          </section>

          <div className="row collapse">
            <div className="column small-12">
              <Banner className="partners">
                <h3 className="c-text -header-normal -normal">We have a massive opportunity<br />to build a sustainable society</h3>
                <Link route="about_partners">
                  <a className="c-btn -transparent -secondary">Partners list</a>
                </Link>
              </Banner>
            </div>
          </div>
        </div>
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
