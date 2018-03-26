import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'routes';

// Components
import CardStatic from 'components/app/common/CardStatic';
import Rating from 'components/app/common/Rating';

function SuggestStoryPost({ insights }) {
  const insightsCardsStatic = insightsData => insightsData.map(c =>
    (
      <CardStatic
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
      </CardStatic>
    ));

  const insightCards = insightsCardsStatic(insights);

  return (
    <aside className="l-postcontent">
      <section id="discoverIsights" className="l-section">
        <div className="l-container">
          <div className="l-section">
            <div className="row align-center">
              <div className="column small-12 medium-8">
                <p>
                  See a connection in the data worth exploring? Let us know about
                  it. We might craft a story around on the lead you sent. Send us
                  what you see, and someone from Resource Watch may be in touch.
                </p>
                <div className="buttons -align-center">
                  <a
                    className="c-button -secondary"
                    href="https://docs.google.com/forms/d/e/1FAIpQLSeOiKYcmW6-SD2ScKHJ5gfq5X28sf3HtJkPDXJ90nWdpgPGuQ/viewform?usp=sf_link"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Suggest a story
                  </a>
                </div>
              </div>
            </div>
          </div>
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

SuggestStoryPost.propTypes = {
  insights: PropTypes.array
};
SuggestStoryPost.defaultProps = {
  insights: []
};

export default SuggestStoryPost;
