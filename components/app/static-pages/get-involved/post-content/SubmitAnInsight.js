import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'routes';

// Components
import CardStatic from 'components/app/common/CardStatic';
import Rating from 'components/app/common/Rating';

export default function SubmitAnInsight({ insights }) {
  const insightsCardsStatic = (insightsData) => {
    return insightsData.map(c =>
      (<CardStatic
        key={`insight-card-${c.tag}`}
        className="-alt"
        background={c.background}
        clickable
        route={c.source.path}
      >
        <div>
          <h4>{c.tag}</h4>
          <h3>
            <Link route={`/insights/${c.slug}`}>
              <a>{c.title}</a>
            </Link>
          </h3>
        </div>
        <div className="footer">
          <div className="source">
            <img src={c.source.img || ''} alt={c.slug} />
            <div className="source-name">
              by <a href={c.source.path}>{c.source.name}</a>
            </div>
          </div>
          {c.ranking && <Rating rating={c.ranking} />}
        </div>
      </CardStatic>)
    );
  };

  const insightCards = insightsCardsStatic(insights);

  return (
    <aside className="l-postcontent">
      <section id="discoverIsights" className="l-section">
        <div className="l-container">
          <div className="insight-cards">
            <div className="row">
              <div className="column small-12 medium-8">
                {insightCards[0]}
              </div>
              <div className="column small-12 medium-4">
                <div className="dual">
                  {insightCards[1]}
                  {insightCards[2]}
                </div>
              </div>
            </div>
          </div>
          <div className="column small-12">
            <div className="buttons -align-center ">
              <div className="column small-12 medium-4">
                <Link
                  route="insights"
                >
                  <a className="c-button -primary -fullwidth">More insights</a>
                </Link>
              </div>
              </div>
          </div>
        </div>
      </section>
    </aside>
  );
}

SubmitAnInsight.propTypes = {
  insights: PropTypes.array
};
SubmitAnInsight.defaultProps = {
  insights: []
};
