import React from 'react';
import isEmpty from 'lodash/isEmpty';

// Redux
import withRedux from 'next-redux-wrapper';
import { getStaticData } from 'redactions/static_pages';
import { initStore } from 'store';

// Next components
import { Link } from 'routes';

// Components
import Page from 'components/app/layout/Page';
import Title from 'components/ui/Title';
import Banner from 'components/app/common/Banner';
import Breadcrumbs from 'components/ui/Breadcrumbs';

class GetInvolved extends React.Component {
  componentWillMount() {
    const { url, data } = this.props;
    const id = url.query.id;

    if (isEmpty(data[id])) {
      this.props.getStaticData(id);
    }
  }

  render() {
    const id = this.props.url.query.id;
    const data = this.props.data[id];
    console.log(data);

    return (
      <Page
        title={data.title || 'Get Involved detail'}
        description={data.summary || 'Get Involved summary'}
      >
        <div className="c-page">
          {/* PAGE HEADER */}
          <div className="c-page-header">
            <div className="l-container">
              <div className="page-header-content -padding-b-2">
                <Breadcrumbs
                  items={[{ name: 'Get Involved', url: 'get_involved' }]}
                />

                <Title className="-primary -huge page-header-title" >
                  {data.title}
                </Title>
              </div>
            </div>
          </div>

          <section className="l-section -bg-grey">
            <div className="l-container">
              <header className="row">
                <div className="column small-12 medium-8">
                  <h1 className="c-text -header-big -primary -thin">{data.summary}</h1>
                </div>
              </header>
              <div className="row description">
                <div
                  className="cols column small-12"
                  dangerouslySetInnerHTML={{ __html: data.description }}
                />
              </div>
            </div>
          </section>

          <div className="row collapse">
            <div className="column small-12">
              <Banner className="partners">
                <h3 className="c-text -header-normal -normal">We have a massive opportunity<br />to build a sustainable society</h3>
                <button className="c-btn -primary -filled">
                  <Link route="about_partners"><a>Partners list</a></Link>
                </button>
              </Banner>
            </div>
          </div>
        </div>
      </Page>
    );
  }
}

GetInvolved.propTypes = {
  url: React.PropTypes.object,
  data: React.PropTypes.object,
  getStaticData: React.PropTypes.func
};

const mapStateToProps = state => ({
  data: state.staticPages
});

const mapDispatchToProps = dispatch => ({
  getStaticData: (slug) => {
    dispatch(getStaticData(slug));
  }
});

export default withRedux(initStore, mapStateToProps, mapDispatchToProps)(GetInvolved)
