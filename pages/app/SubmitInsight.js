import React from 'react';
import { Link } from 'routes';
import Banner from 'components/app/common/Banner';
import Breadcrumbs from 'components/ui/Breadcrumbs';
import Page from 'components/app/layout/Page';
import { initStore } from 'store';
import { getStaticData } from 'redactions/static_pages';
import withRedux from 'next-redux-wrapper';

const breadcrumbs = [
  {
    name: 'Get Involved',
    url: '/get-involved'
  }
];

class SubmitInsight extends React.Component {
  componentWillMount() {
    this.props.getStaticData('submit-an-insight', 'submitInsight');
  }

  render() {
    const { data } = this.props;

    return (
      <Page
        title="Submit Insight"
        description="Submit insight description"
      >
        <div className="p-submit-insight">
          <div className="c-page">
            <section className="l-section -header">
              <div className="l-container">
                <Breadcrumbs items={breadcrumbs} />
                <header>
                  <h1 className="c-text -header-big -thin">{data.title}</h1>
                </header>
              </div>
            </section>

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
                    <Link to="about_partners"><a>Partners list</a></Link>
                  </button>
                </Banner>
              </div>
            </div>
          </div>
        </div>
      </Page>
    );
  }
}

SubmitInsight.propTypes = {
  data: React.PropTypes.object,
  getStaticData: React.PropTypes.func
};

const mapStateToProps = state => ({
  data: state.staticPages.submitInsight
});

const mapDispatchToProps = dispatch => ({
  getStaticData: (slug, ref) => {
    dispatch(getStaticData(slug, ref));
  }
});

export default withRedux(initStore, mapStateToProps, mapDispatchToProps)(SubmitInsight)
