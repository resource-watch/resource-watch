import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'routes';

// Components
import CardStatic from 'components/app/common/CardStatic';
import Rating from 'components/app/common/Rating';
import Banner from 'components/app/common/Banner';

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
    <div>
      <aside className="l-postcontent">
        <div className="l-container">
          <div className="row">
            <div className="column small-12 medium-8">
              <h2>Latest stories</h2>
            </div>
          </div>
          <div className="row align-center">
            <div className="column small-12">
              <div className="buttons">
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
      </aside>
      <aside className="l-postcontent">
        <section id="discoverIsights" className="l-container">
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
                  <a className="c-button -primary -fullwidth">More stories</a>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </aside>
      <aside className="l-postcontent">
        <div className="l-container">
          <div className="row align-center">
            <div className="column small-12">
              <Banner className="-text-center" bgImage="/static/images/backgrounds/partners-02@2x.jpg">
                <p className="-claim">
                  Questions, comments, or feedback? <br />
                  Help us improve Resource Watch.
                </p>
                <Link to="about_contact-us">
                  <a className="c-button -alt -primary">Contact us</a>
                </Link>
              </Banner>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}

SuggestStoryPost.propTypes = {
  insights: PropTypes.array
};
SuggestStoryPost.defaultProps = {
  insights: []
};

export default SuggestStoryPost;
