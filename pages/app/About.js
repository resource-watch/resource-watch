import React from 'react';
import Link from 'next/link';
import Banner from 'components/app/common/Banner';
import Intro from 'components/app/common/Intro';
import Page from 'components/app/layout/Page';
import { initStore } from 'store';
import { getStaticData } from 'redactions/static_pages'
import withRedux from 'next-redux-wrapper';

class About extends React.Component {
  componentDidMount() {
    this.props.getStaticData('about');
  }

  render() {
    const { data } = this.props;
    const styles = {};
    if (data && data.photo) {
      styles.backgroundImage = `url(${process.env.CMS_API_URL}${data.photo.large})`;
    }

    return (
      <Page
        title="About"
        description="About description..."
      >
        <div className="p-about">
          <div className="c-page">
            <Intro title={data && data.title} intro={data && data.summary} styles={styles} />
            <section className="l-section">
              <div className="l-container">
                <div className="row collapse">
                  {/* Convert string content to html */}
                  <div
                    className="description column small-12 medium-8 medium-offset-2"
                    dangerouslySetInnerHTML={{ __html: data && data.description }}
                  />
                </div>
              </div>
            </section>

            <div className="row collapse">
              <div className="column small-12">
                <Banner className="partners">
                  <h3 className="c-text -header-normal -normal">We have a massive opportunity<br />to build a sustainable society</h3>
                  <button className="c-btn -primary -filled">
                    <Link href="about_partners">Partners list</Link>
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

About.propTypes = {
  data: React.PropTypes.object,
  getStaticData: React.PropTypes.func
};

const mapDispatchToProps = dispatch => ({
  getStaticData: (slug, ref) => {
    dispatch(getStaticData(slug, ref));
  }
});

export default withRedux(initStore, null, mapDispatchToProps)(About)
