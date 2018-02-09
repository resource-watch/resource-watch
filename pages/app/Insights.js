import React from 'react';
import { Link } from 'routes';
import withRedux from 'next-redux-wrapper';
import Breadcrumbs from 'components/ui/Breadcrumbs';
import { initStore } from 'store';
import { getInsights } from 'redactions/insights';

// Layout
import Page from 'components/app/layout/Page';
import Layout from 'components/app/layout/Layout';

// Components
import CardStatic from 'components/app/common/CardStatic';
import Rating from 'components/app/common/Rating';

class Insights extends Page {
  static insightsCardsStatic(insightsData) {
    return insightsData.map(c =>
      (<CardStatic
        key={`insight-card-${c.slug}`}
        className={`-alt ${c.link ? '-clickable' : ''}`}
        background={c.background}
        clickable={!!c.link}
        route={c.link ? c.link : ''}
      >
        <div>
          <h4>{c.tag}</h4>
          <h3>
            { c.link ?
              <Link route={`/blog/${c.slug}`}>
                <a>{c.title}</a>
              </Link>
              :
              <span>{c.title}</span>
            }
          </h3>
        </div>
        <div className="footer">
          <div className="source">
            <img src={c.source.img || ''} alt={c.slug} />
            <div className="source-name">
              by <a href={c.source.path} target="_blank">{c.source.name}</a>
            </div>
          </div>
          {c.ranking && <Rating rating={c.ranking} />}
        </div>
      </CardStatic>)
    );
  }

  componentDidMount() {
    this.props.getInsights();
  }

  render() {
    const { insights } = this.props;
    const insightsCardsStatic = Insights.insightsCardsStatic(insights);

    return (
      <Layout
        title="Blog"
        description="Read the latest analysis from our community or submit your own original story."
        url={this.props.url}
        user={this.props.user}
        className="page-insights"
        pageHeader
      >
        <div className="l-page-header">
          <div className="l-container">
            <div className="row">
              <div className="column small-12">
                <div className="page-header-content">
                  <Breadcrumbs items={[{ name: 'Home', href: '/' }]} />
                  <h1>Signals Blog</h1>

                  <div className="page-header-info">
                    <p>Explore the stories behind the data and submit your own.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <section id="discoverIsights" className="l-section">
          <div className="l-container">

            <div className="insight-cards">
              <div className="row">
                <div className="column small-12 medium-8">
                  {insightsCardsStatic[0]}
                </div>
                <div className="column small-12 medium-4">
                  <div className="dual">
                    {insightsCardsStatic[1]}
                    {insightsCardsStatic[2]}
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>

      </Layout>
    );
  }
}

const mapStateToProps = state => ({ insights: state.insights.list });

const mapDispatchToProps = {
  getInsights
};

export default withRedux(initStore, mapStateToProps, mapDispatchToProps)(Insights);
