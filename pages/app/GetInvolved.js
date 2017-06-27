import React from 'react';
import { Link } from 'routes';
import withRedux from 'next-redux-wrapper';
import { getStaticData } from 'redactions/static_pages';
import { initStore } from 'store';
import Banner from 'components/app/common/Banner';
import Intro from 'components/app/common/Intro';
import CardStatic from 'components/app/common/CardStatic';
import Page from 'components/app/layout/Page';

const cards = [
  {
    id: 'insights',
    title: 'Submit an insight',
    intro: ['Lorem ipsum sit amet casius sem', 'lacinia quam venenatis vestibulum'],
    buttons: [
      {
        text: 'Submit an insight',
        route: 'get_involved_detail',
        params: { id: 'submit-an-insight' },
        className: '-filled'
      }
    ],
    className: 'insights'
  },
  {
    id: 'data',
    title: 'Contribute data',
    intro: ['Lorem ipsum sit amet casius sem', 'lacinia quam venenatis vestibulum'],
    buttons: [
      {
        text: 'Contribute data',
        route: 'get_involved_detail',
        params: { id: 'contribute-data' },
        className: '-filled'
      }
    ],
    className: 'contribute'
  },
  {
    id: 'join',
    title: 'Join the community',
    intro: ['Lorem ipsum sit amet casius sem', 'lacinia quam venenatis vestibulum'],
    buttons: [
      {
        text: 'Join the community',
        route: 'get_involved_detail',
        params: { id: 'join-community' },
        className: '-filled'
      }
    ],
    className: 'join'
  },
  {
    id: 'app',
    title: 'Develop your app',
    intro: ['Lorem ipsum sit amet casius sem', 'lacinia quam venenatis vestibulum'],
    buttons: [
      {
        text: 'Develop your app',
        route: 'get_involved_detail',
        params: { id: 'develop-app' },
        className: '-filled'
      },
      {
        text: 'Apps gallery',
        route: 'get_involved_detail',
        params: { id: 'apps' },
        className: '-transparent -secondary'
      }
    ],
    className: 'develop'
  }
];

class GetInvolved extends React.Component {
  componentWillMount() {
    this.props.getStaticData('get-involved', 'getInvolved');
  }

  render() {
    const { data } = this.props;
    const styles = {};
    if (data.photo) {
      styles.backgroundImage = `url(${process.env.CMS_API_URL}${data.photo.large})`;
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
              <button key={j} className={`c-btn ${b.className}`}>
                <Link route={b.route} params={b.params}><a>{b.text}</a></Link>
              </button>
            ))}
          </div>
        </CardStatic>
      </div>)
    );

    return (
      <Page
        title="Get Involved"
        description="Get Involved description"
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
                  <button className="c-btn -primary">
                    Get in touch
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

GetInvolved.propTypes = {
  data: React.PropTypes.object,
  getStaticData: React.PropTypes.func
};

const mapStateToProps = state => ({
  data: state.staticPages.getInvolved
});

const mapDispatchToProps = dispatch => ({
  getStaticData: (slug, ref) => {
    dispatch(getStaticData(slug, ref));
  }
});

export default withRedux(initStore, mapStateToProps, mapDispatchToProps)(GetInvolved)
