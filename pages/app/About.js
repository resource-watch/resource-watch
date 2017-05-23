import React from 'react';
import Link from 'next/link';
import Banner from 'components/app/common/Banner';
import Intro from 'components/app/common/Intro';

class About extends React.Component {
  componentDidMount() {
    this.props.getStaticData('about');
  }

  render() {
    const { data } = this.props;
    const styles = {};
    if (data.photo) {
      styles.backgroundImage = `url(${config.CMS_API_URL}${data.photo.large})`;
    }

    return (
      <div className="p-about">
        <div className="c-page">
          <Intro title={data.title} intro={data.summary} styles={styles} />
          <section className="l-section">
            <div className="l-container">
              <div className="row collapse">
                {/* Convert string content to html */}
                <div
                  className="description column small-12 medium-8 medium-offset-2"
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
                  <Link href="about_partners">Partners list</Link>
                </button>
              </Banner>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

About.propTypes = {
  data: React.PropTypes.object,
  getStaticData: React.PropTypes.func
};

export default About;
