import React from 'react';
import { Link } from 'routes';
import withRedux from 'next-redux-wrapper';
import { getStaticData } from 'redactions/static_pages';
import { initStore } from 'store';
import Banner from 'components/app/common/Banner';
import Intro from 'components/app/common/Intro';
import CardStatic from 'components/app/common/CardStatic';
import Page from 'components/app/layout/Page';
import Layout from 'components/app/layout/Layout';

const cards = [
  {
    id: 'insights',
    title: 'Submit an insight',
    intro: ['Tell a story with data. Share content seamlessly with the world and inspire action.'],
    buttons: [
      {
        text: 'Submit an insight',
        route: 'get_involved_detail',
        params: { id: 'submit-an-insight' },
        className: ''
      }
    ],
    className: 'insights'
  },
  {
    id: 'data',
    title: 'Contribute data',
    intro: ['Extend the reach and impact of your datasets. Upload for private or public use, and see how many are using it.'],
    buttons: [
      {
        text: 'Contribute data',
        route: 'get_involved_detail',
        params: { id: 'contribute-data' },
        className: ''
      }
    ],
    className: 'contribute'
  },
  {
    id: 'join',
    title: 'Join the community',
    intro: ['Resource Watch is an open platform for everyone to explore data and insights about our planet.'],
    buttons: [
      {
        text: 'Join the community',
        route: 'get_involved_detail',
        params: { id: 'join-community' },
        className: ''
      }
    ],
    className: 'join'
  },
  {
    id: 'app',
    title: 'Develop your app',
    intro: ['Power your application with the Resource Watch API, or build on our open source code for your next project.'],
    buttons: [
      {
        text: 'Develop your app',
        route: 'get_involved_detail',
        params: { id: 'develop-app' },
        className: ''
      },
      {
        text: 'Apps gallery',
        route: 'get_involved_detail',
        params: { id: 'apps' },
        className: ''
      }
    ],
    className: 'develop'
  }
];

class GetInvolved extends Page {
  componentDidMount() {
    super.componentDidMount();
    this.props.getStaticData('get-involved');
  }

  render() {
    const { data } = this.props;
    const styles = {};

    if (!data) return null;

    if (data && data.photo) {
      styles.backgroundImage = `url(${process.env.CMS_API_URL}/../${data.photo.large})`;
    }

    const introLines = intro => (
      intro.map((line, i) => (
        <span key={i}>
          {line}{(i !== intro.length - 1) && <br />}
        </span>))
    );

    const cardsStatic = cards.map((c, i) =>
      (<div key={i} className="column small-12 medium-6">
        <CardStatic className={`-light ${c.className}`} background={c.background}>
          <div>
            <h2 className="title c-text -header-normal -thin">{c.title}</h2>
            <p className="c-text -big">{introLines(c.intro)}</p>
          </div>
          <div className="buttons">
            {c.buttons.map((b, j) => (
              <button key={j} className={`c-button -primary ${b.className}`}>
                <Link route={b.route} params={b.params}><a>{b.text}</a></Link>
              </button>
            ))}
          </div>
        </CardStatic>
      </div>)
    );

    return (
      <Layout
        title="Get Involved"
        description="Get Involved description"
        url={this.props.url}
        user={this.props.user}
      >
        <div className="p-get-involved">
          <div className="c-page">
            <Intro title={data.title} intro={data.summary} styles={styles} />
            <section className="l-section -header">
              <div className="l-container">
                <div className="cards row collapse">
                  {cardsStatic}
                </div>
              </div>
            </section>

            <div className="row collapse">
              <div className="column small-12">
                <Banner className="partners">
                  <h3 className="c-text -header-normal -thin">
                    See yourself as part <br />of this team?
                  </h3>
                  <button className="c-button -primary">
                    Get in touch
                  </button>
                </Banner>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }
}

GetInvolved.propTypes = {
  data: React.PropTypes.object,
  getStaticData: React.PropTypes.func
};

const mapStateToProps = state => ({
  data: state.staticPages['get-involved']
});

const mapDispatchToProps = dispatch => ({
  getStaticData: (slug, ref) => {
    dispatch(getStaticData(slug, ref));
  }
});

export default withRedux(initStore, mapStateToProps, mapDispatchToProps)(GetInvolved)
